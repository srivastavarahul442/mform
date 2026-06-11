import SubmissionService from "../../../../../be/services/SubmissionService";

const submissionService = new SubmissionService();

export async function GET(request, { params }) {
  return submissionService.getSubmissionById(
    request,
    params,
  );
}