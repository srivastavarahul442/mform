import FormService from "../../../../be/services/FormService";

const formService = new FormService();

export async function POST(request) {
    return formService.createForm(request);
}

export async function GET(request) {
    return formService.getForms(request);
}
