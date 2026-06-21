import FormService from "../../../../../be/services/FormService";

const formService = new FormService();

export async function GET(request, { params }) {
  return formService.getFormById(request, params);
}

// PATCH: update form sections/fields (creates a new FormVersion draft)
export async function PATCH(request, { params }) {
  return formService.updateForm(request, params);
}

// PUT: update form meta only (title + description on the Form document)
export async function PUT(request, { params }) {
  return formService.updateFormMeta(request, params);
}