import AnalyticsService from "../../../../../../be/services/AnalyticsService";

const analyticsService = new AnalyticsService();

export async function GET(request, { params }) {
  return analyticsService.getFormAnalytics(request, params);
}
