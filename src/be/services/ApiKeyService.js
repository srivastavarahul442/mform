import { NextResponse } from "next/server";
import { connectDB } from "../config/db";
import ApiKey from "../models/ApiKey";
import Form from "../models/Form";
import FormVersion from "../models/FormVersion";
import FormInvite from "../models/FormInvite";
import { loginAuth } from "../middlewares/loginAuth";
import { apiKeyAuth, generateRawApiKey, hashApiKey } from "../utils/apiKeyAuth";
import { v4 as uuidv4 } from "uuid";

class ApiKeyService {
  // ─── Dashboard: Create a new API key ────────────────────────────────────────
  async createApiKey(request) {
    await connectDB();
    try {
      const currentUser = await loginAuth(request);
      const body = await request.json();
      const { name } = body;

      if (!name || !name.trim()) {
        return NextResponse.json(
          { success: false, message: "Key name is required" },
          { status: 400 }
        );
      }

      const rawKey = generateRawApiKey();
      const keyHash = hashApiKey(rawKey);
      const keyPrefix = rawKey.slice(0, 18); // "mfk_sk_XXXXXXXXXX"

      await ApiKey.create({
        companyId: currentUser.companyId,
        createdBy: currentUser._id,
        name: name.trim(),
        keyHash,
        keyPrefix,
      });

      // Return the raw key ONCE — we never show it again
      return NextResponse.json(
        { success: true, key: rawKey, keyPrefix, name: name.trim() },
        { status: 201 }
      );
    } catch (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }
  }

  // ─── Dashboard: List all API keys (no raw key) ──────────────────────────────
  async listApiKeys(request) {
    await connectDB();
    try {
      const currentUser = await loginAuth(request);

      const keys = await ApiKey.find({ companyId: currentUser.companyId })
        .sort({ createdAt: -1 })
        .select("-keyHash");

      return NextResponse.json({ success: true, keys });
    } catch (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }
  }

  // ─── Dashboard: Revoke a key ─────────────────────────────────────────────────
  async revokeApiKey(request, params) {
    await connectDB();
    try {
      const currentUser = await loginAuth(request);
      const { keyId } = await params;

      const key = await ApiKey.findOne({
        _id: keyId,
        companyId: currentUser.companyId,
      });

      if (!key) {
        return NextResponse.json(
          { success: false, message: "API key not found" },
          { status: 404 }
        );
      }

      key.isActive = false;
      await key.save();

      return NextResponse.json({ success: true, message: "API key revoked" });
    } catch (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }
  }

  // ─── External Public API: Generate an invite ─────────────────────────────────
  async generateExternalInvite(request, params) {
    await connectDB();
    console.log("Generating external invite");
    try {
      // Use API key auth instead of session auth
      const apiKey = await apiKeyAuth(request);
      const { id } = await params;
      const body = await request.json();
      const { name, phone, email } = body;

      if (!phone) {
        return NextResponse.json(
          { success: false, message: "phone is required" },
          { status: 400 }
        );
      }

      const form = await Form.findOne({
        _id: id,
        companyId: apiKey.companyId,
        status: "published",
        isDeleted: false,
      });

      if (!form) {
        return NextResponse.json(
          { success: false, message: "Published form not found or does not belong to your company" },
          { status: 404 }
        );
      }

      const version = await FormVersion.findOne({
        formId: form._id,
        version: form.activeVersion,
        status: "published",
      });

      if (!version) {
        return NextResponse.json(
          { success: false, message: "Published form version not found" },
          { status: 404 }
        );
      }

      const token = uuidv4();

      const invite = await FormInvite.create({
        companyId: form.companyId,
        formId: form._id,
        versionId: version._id,
        createdBy: apiKey.createdBy,
        targetUser: { name, phone, email },
        token,
      });

      // Build the public URL for the invite
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
      const url = `${baseUrl}/f/${form._id}?token=${token}`;

      return NextResponse.json(
        {
          success: true,
          url,
          token,
          invite: {
            id: invite._id,
            formId: form._id,
            formTitle: form.title,
            targetUser: invite.targetUser,
            status: invite.status,
            createdAt: invite.createdAt,
          },
        },
        { status: 201 }
      );
    } catch (error) {
      const status = error.message.includes("API key") ? 401 : 500;
      return NextResponse.json(
        { success: false, message: error.message },
        { status }
      );
    }
  }
}

export default ApiKeyService;
