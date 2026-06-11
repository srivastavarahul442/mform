import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import Company from "../models/Company";
import User from "../models/User";

import { generateToken } from "../utils/jwt";
import { loginAuth } from "../middlewares/loginAuth";
import { connectDB } from "../config/db";

class AuthService {
  async registerCompany(request) {
    await connectDB();
    try {
      const body = await request.json();

      const { companyName, firstName, email, password } = body;

      if (!companyName || !firstName || !email || !password) {
        return NextResponse.json(
          {
            success: false,
            message: "All fields are required",
          },
          { status: 400 },
        );
      }

      const existingUser = await User.findOne({
        email: email.toLowerCase(),
      });

      if (existingUser) {
        return NextResponse.json(
          {
            success: false,
            message: "Email already exists",
          },
          { status: 400 },
        );
      }

      const company = await Company.create({
        name: companyName,
        slug: companyName.toLowerCase().replace(/\s+/g, "-"),
        email: email.toLowerCase(),
      });

      const hashedPassword = await bcrypt.hash(password, 10);

      const owner = await User.create({
        companyId: company._id,
        firstName,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: "owner",
      });

      company.ownerId = owner._id;

      await company.save();

      const token = generateToken({
        userId: owner._id,
        companyId: company._id,
      });

      const ownerResponse = owner.toObject();

      delete ownerResponse.password;

      return NextResponse.json(
        {
          success: true,
          token,
          company,
          user: ownerResponse,
        },
        { status: 201 },
      );
    } catch (error) {
      console.error("registerCompany error:", error);

      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 500 },
      );
    }
  }

  async login(request) {
    try {
      await connectDB();
      const body = await request.json();

      const { email, password } = body;

      const user = await User.findOne({
        email: email.toLowerCase(),
      });

      if (!user) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid credentials",
          },
          { status: 401 },
        );
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid credentials",
          },
          { status: 401 },
        );
      }

      const token = generateToken({
        userId: user._id,
        companyId: user.companyId,
        role: user.role,
      });

      const response = NextResponse.json({
        success: true,
        user: {
          _id: user._id,
          firstName: user.firstName,
          email: user.email,
          companyId: user.companyId,
        },
      });

      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });

      return response;
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 500 },
      );
    }
  }
  async me(request) {
    await connectDB();
    try {
      const currentUser = await loginAuth(request);
      return NextResponse.json({ success: true, user: currentUser });
    } catch (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 401 },
      );
    }
  }
}

export default AuthService;
