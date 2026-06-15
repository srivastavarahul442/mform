import { NextResponse } from "next/server";

import Form from "../models/Form";
import Submission from "../models/Submission";
import { connectDB } from "../config/db";

import { loginAuth } from "../middlewares/loginAuth";
// This service handles analytics-related operations, such as fetching submission counts for forms.
class AnalyticsService {
  /// GET /api/forms/[id]/analytics
  async getFormAnalytics(request, params) {
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

      const now = new Date();

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const [
        totalSubmissions,
        todaySubmissions,
        last7DaysSubmissions,
        last30DaysSubmissions,
      ] = await Promise.all([
        Submission.countDocuments({
          formId: form._id,
        }),

        Submission.countDocuments({
          formId: form._id,
          createdAt: {
            $gte: todayStart,
          },
        }),

        Submission.countDocuments({
          formId: form._id,
          createdAt: {
            $gte: last7Days,
          },
        }),

        Submission.countDocuments({
          formId: form._id,
          createdAt: {
            $gte: last30Days,
          },
        }),
      ]);

      return NextResponse.json({
        success: true,

        analytics: {
          totalSubmissions,

          todaySubmissions,

          last7DaysSubmissions,

          last30DaysSubmissions,
        },
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

export default AnalyticsService;
