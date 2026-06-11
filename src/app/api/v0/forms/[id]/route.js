import FormService from "../../../../../be/services/FormService";

const formService = new FormService();

export async function GET(request, { params }) {
  return formService.getFormById(request, params);
}

export async function PATCH(request, { params }) {
  return formService.updateForm(request, params);
}