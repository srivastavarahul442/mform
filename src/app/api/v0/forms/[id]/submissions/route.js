import FormService from "../../../../../../be/services/FormService";

const formService = new FormService();

export async function GET(request, { params }) {
  return formService.getFormSubmissions(request, params);
}