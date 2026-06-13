import FormService from "../../../../../../be/services/FormService";

const formService = new FormService();

export async function POST(request, { params }) {
  return formService.generateInvite(request, params);
}
