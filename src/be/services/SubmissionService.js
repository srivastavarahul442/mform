import { NextResponse } from "next/server";

import Submission from "../models/Submission";
import Form from "../models/Form";
import { connectDB } from "../config/db";

import { loginAuth } from "../middlewares/loginAuth";

class SubmissionService {
  async getSubmissionById(request, params) {
    await connectDB();
    try {
      const currentUser = await loginAuth(request);

      const { id } = await params;

      const submission = await Submission.findById(id)
        .populate("formId", "title description")
        .populate("versionId", "version");

      if (!submission) {
        return NextResponse.json(
          {
            success: false,
            message: "Submission not found",
          },
          {
            status: 404,
          },
        );
      }

      const form = await Form.findOne({
        _id: submission.formId._id,

        companyId: currentUser.companyId,

        isDeleted: false,
      });

      if (!form) {
        return NextResponse.json(
          {
            success: false,
            message: "Unauthorized access",
          },
          {
            status: 403,
          },
        );
      }

      return NextResponse.json({
        success: true,
        submission,
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

export default SubmissionService;
