import { NextResponse } from "next/server";

import Form from "../models/Form";
import FormVersion from "../models/FormVersion";
import Submission from "../models/Submission";
import { connectDB } from "../config/db";
import { validateSubmission } from "../utils/formValidator";

import { loginAuth } from "../middlewares/loginAuth";

class FormService {
  async createForm(request) {
    try {
      const currentUser = await loginAuth(request);

      const body = await request.json();

      const { title, description } = body;

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
      const currentUser = await loginAuth(request);

      const forms = await Form.find({
        companyId: currentUser.companyId,

        isDeleted: false,
      })
        .populate("createdBy", "firstName email")
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

      const version = await FormVersion.findOne({
        formId: form._id,
        version: form.activeVersion,
      });

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
        .populate("createdBy", "firstName email")
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

      return NextResponse.json({
        success: true,

        form: {
          _id: form._id,
          title: form.title,
          description: form.description,
        },

        sections: version.sections,
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
      const { id } = await params;

      const body = await request.json();

      const { answers } = body;

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

      const submission = await Submission.create({
        companyId: form.companyId,
        formId: form._id,
        versionId: version._id,
        answers,
      });

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
}

export default FormService;
