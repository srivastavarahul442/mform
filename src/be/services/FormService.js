import { NextResponse } from "next/server";

import Form from "../models/Form";
import FormVersion from "../models/FormVersion";
import Submission from "../models/Submission";
import FormInvite from "../models/FormInvite";
import { connectDB } from "../config/db";
import { v4 as uuidv4 } from "uuid";
import { validateSubmission } from "../utils/formValidator";
import { isValidEmail, isValidPhone, } from "../utils/validators";

import { loginAuth } from "../middlewares/loginAuth";

class FormService {
  async createForm(request) {
    await connectDB();
    try {
      const currentUser = await loginAuth(request);

      const body = await request.json();

      const { title, description, allowMultipleSubmissions } = body;

      if (!title) {
        return NextResponse.json(
          {
            success: false,
            message: "Title is required",
          },
          {
            status: 400,
          },
        );
      }

      const slug =
        title.toLowerCase().trim().replace(/\s+/g, "-") + "-" + Date.now();

      const form = await Form.create({
        companyId: currentUser.companyId,
        createdBy: currentUser._id,
        title,
        description,
        slug,
        allowMultipleSubmissions
      });

      await FormVersion.create({
        companyId: currentUser.companyId,
        formId: form._id,
        version: 1,
        createdBy: currentUser._id,
      });

      return NextResponse.json(
        {
          success: true,
          form,
        },
        {
          status: 201,
        },
      );
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: 500,
        },
      );
    }
  }

  async getForms(request) {
    try {
      await connectDB();
      const currentUser = await loginAuth(request);

      const forms = await Form.find({
        companyId: currentUser.companyId,

        isDeleted: false,
      })
        .populate("createdBy", "firstName lastName email")
        .sort({
          createdAt: -1,
        });

      return NextResponse.json({
        success: true,
        count: forms.length,
        forms,
      });
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: 500,
        },
      );
    }
  }

  async getFormById(request, params) {
    await connectDB();
    try {
      const currentUser = await loginAuth(request);

      const { id } = await params;

      const form = await Form.findOne({
        _id: id,
        companyId: currentUser.companyId,
        isDeleted: false,
      });

      if (!form) {
        return NextResponse.json(
          {
            success: false,
            message: "Form not found",
          },
          {
            status: 404,
          },
        );
      }

      console.log(form.latestVersion, form)

      const version = await FormVersion.findOne({
        formId: form._id,
        version: form.latestVersion,
      });
      console.log(version)

      return NextResponse.json({
        success: true,
        form,
        version,
      });
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: 500,
        },
      );
    }
  }

  async updateForm(request, params) {
    try {
      await connectDB();
      const currentUser = await loginAuth(request);

      const { id } = await params;

      const body = await request.json();

      const { sections } = body;

      const form = await Form.findOne({
        _id: id,
        companyId: currentUser.companyId,
        isDeleted: false,
      });

      if (!form) {
        return NextResponse.json(
          {
            success: false,
            message: "Form not found",
          },
          {
            status: 404,
          },
        );
      }

      let version = await FormVersion.findOne({
        formId: form._id,
        version: form.latestVersion,
      });

      if (!version) {
        return NextResponse.json(
          {
            success: false,
            message: "Version not found",
          },
          {
            status: 404,
          },
        );
      }

      // Published Version
      // Create New Draft Version

      if (version.status === "published") {
        const nextVersion = form.latestVersion + 1;

        version = await FormVersion.create({
          companyId: form.companyId,
          formId: form._id,
          version: nextVersion,
          sections: sections || version.sections,
          status: "draft",
          createdBy: currentUser._id,
        });

        form.latestVersion = nextVersion;
        form.status = "draft";

        await form.save();

        return NextResponse.json({
          success: true,
          message: `Draft Version ${nextVersion} created`,
          version,
        });
      }

      // Existing Draft

      version.sections = sections || [];

      await version.save();

      return NextResponse.json({
        success: true,
        message: "Draft updated successfully",
        version,
      });
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: 500,
        },
      );
    }
  }

  async publishForm(request, params) {
    try {
      await connectDB();
      const currentUser = await loginAuth(request);

      const { id } = await params;

      const form = await Form.findOne({
        _id: id,
        companyId: currentUser.companyId,
        isDeleted: false,
      });

      if (!form) {
        return NextResponse.json(
          {
            success: false,
            message: "Form not found",
          },
          {
            status: 404,
          },
        );
      }

      const draftVersion = await FormVersion.findOne({
        formId: form._id,
        version: form.latestVersion,
        status: "draft",
      });

      if (!draftVersion) {
        return NextResponse.json(
          {
            success: false,
            message: "Draft version not found",
          },
          {
            status: 404,
          },
        );
      }

      draftVersion.status = "published";

      await draftVersion.save();

      form.status = "published";

      form.activeVersion = draftVersion.version;

      await form.save();

      return NextResponse.json({
        success: true,
        message: "Form published successfully",
        version: draftVersion.version,
      });
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: 500,
        },
      );
    }
  }

  async getFormVersions(request, params) {
    try {
      await connectDB();
      const currentUser = await loginAuth(request);

      const { id } = await params;

      const form = await Form.findOne({
        _id: id,
        companyId: currentUser.companyId,
        isDeleted: false,
      });

      if (!form) {
        return NextResponse.json(
          {
            success: false,
            message: "Form not found",
          },
          {
            status: 404,
          },
        );
      }

      const versions = await FormVersion.find({
        formId: form._id,
      })
        .select("version status createdAt updatedAt createdBy")
        .populate("createdBy", "firstName lastName email")
        .sort({
          version: -1,
        });

      return NextResponse.json({
        success: true,
        activeVersion: form.activeVersion,
        latestVersion: form.latestVersion,
        count: versions.length,
        versions,
      });
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: 500,
        },
      );
    }
  }

  async getPublicForm(request, params) {
    try {
      await connectDB();
      const { id } = await params;

      const form = await Form.findOne({
        _id: id,
        status: "published",
        isDeleted: false,
      });

      if (!form) {
        return NextResponse.json(
          {
            success: false,
            message: "Form not found",
          },
          {
            status: 404,
          },
        );
      }

      const version = await FormVersion.findOne({
        formId: form._id,
        version: form.activeVersion,
        status: "published",
      });

      // Handle token if present
      const token = request.nextUrl?.searchParams?.get("token");
      let prefilledUser = null;

      if (token) {
        const invite = await FormInvite.findOne({ token, formId: form._id });
        if (!invite) {
          return NextResponse.json({ success: false, message: "Invalid or expired unique link" }, { status: 400 });
        }
        if (invite.status === "completed") {
          return NextResponse.json({ success: false, message: "This unique link has already been used" }, { status: 400 });
        }
        prefilledUser = invite.targetUser;
      }

      return NextResponse.json({
        success: true,

        form: {
          _id: form._id,
          title: form.title,
          description: form.description,
        },

        sections: version.sections,
        prefilledUser,
      });
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: 500,
        },
      );
    }
  }

  async submitForm(request, params) {
    try {
      await connectDB();
      const { id } = await params;

      const body = await request.json();

      const { answers, submittedBy, token } = body;

      if (!submittedBy?.phone) {
        return NextResponse.json(
          {
            success: false,
            message: "Phone number is required",
          },
          {
            status: 400,
          },
        );
      }

      if (!isValidPhone(submittedBy.phone)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid phone number",
          },
          {
            status: 400,
          },
        );
      }

      if (
        submittedBy.email &&
        !isValidEmail(submittedBy.email)
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid email",
          },
          {
            status: 400,
          },
        );
      }

      const form = await Form.findOne({
        _id: id,
        status: "published",
        isDeleted: false,
      });

      if (!form) {
        return NextResponse.json(
          {
            success: false,
            message: "Form not found",
          },
          {
            status: 404,
          },
        );
      }

      const version = await FormVersion.findOne({
        formId: form._id,
        version: form.activeVersion,
        status: "published",
      });

      if (!version) {
        return NextResponse.json(
          {
            success: false,
            message: "Published version not found",
          },
          {
            status: 404,
          },
        );
      }

      const errors = validateSubmission(version.sections, answers);

      if (errors.length > 0) {
        return NextResponse.json(
          {
            success: false,
            errors,
          },
          {
            status: 400,
          },
        );
      }

      let invite = null;
      if (token) {
        invite = await FormInvite.findOne({ token, formId: form._id });
        if (!invite || invite.status === "completed") {
          return NextResponse.json({ success: false, message: "Invalid or already used unique link" }, { status: 400 });
        }
        // Force submittedBy to match the invite target user
        submittedBy.phone = invite.targetUser.phone;
        submittedBy.email = invite.targetUser.email;
        submittedBy.name = invite.targetUser.name;
      }

      if (!form.allowMultipleSubmissions && !token) {
        const existingSubmission =
          await Submission.findOne({
            formId: form._id,

            "submittedBy.phone":
              submittedBy.phone,
          });

        if (existingSubmission) {
          return NextResponse.json(
            {
              success: false,
              message:
                "You have already submitted this form",
            },
            {
              status: 409,
            },
          );
        }
      }

      const submission = await Submission.create({
        companyId: form.companyId,
        formId: form._id,
        versionId: version._id,
        submittedBy,
        answers,
      });

      if (invite) {
        invite.status = "completed";
        invite.submissionId = submission._id;
        await invite.save();
      }

      return NextResponse.json(
        {
          success: true,
          message: "Form submitted successfully",
          submissionId: submission._id,
        },
        {
          status: 201,
        },
      );
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: 500,
        },
      );
    }
  }

  async getFormSubmissions(request, params) {
    try {
      await connectDB();
      const currentUser = await loginAuth(request);

      const { id } = await params;

      const form = await Form.findOne({
        _id: id,
        companyId: currentUser.companyId,
        isDeleted: false,
      });

      if (!form) {
        return NextResponse.json(
          {
            success: false,
            message: "Form not found",
          },
          {
            status: 404,
          },
        );
      }

      const submissions = await Submission.find({
        formId: form._id,
      }).sort({
        createdAt: -1,
      });

      return NextResponse.json({
        success: true,
        count: submissions.length,
        submissions,
      });
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: 500,
        },
      );
    }
  }

  async generateInvite(request, params) {
    await connectDB();
    try {
      const currentUser = await loginAuth(request);
      const { id } = await params;
      const body = await request.json();
      const { name, phone, email } = body;

      if (!phone) {
        return NextResponse.json({ success: false, message: "Phone number is required for the target user" }, { status: 400 });
      }

      const form = await Form.findOne({
        _id: id,
        companyId: currentUser.companyId,
        isDeleted: false,
      });

      if (!form) return NextResponse.json({ success: false, message: "Form not found" }, { status: 404 });

      const version = await FormVersion.findOne({
        formId: form._id,
        version: form.activeVersion,
        status: "published",
      });

      if (!version) return NextResponse.json({ success: false, message: "Published form version not found" }, { status: 404 });

      const token = uuidv4();

      const invite = await FormInvite.create({
        companyId: form.companyId,
        formId: form._id,
        versionId: version._id,
        createdBy: currentUser._id,
        targetUser: { name, phone, email },
        token,
      });

      return NextResponse.json({ success: true, token, invite });
    } catch (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
  }
}

export default FormService;
