import FormService from "../../../../../../../be/services/FormService";

const formService = new FormService();

// GET /api/v0/forms/[id]/versions/[version]
// Returns full version data (with sections) for read-only preview
export async function GET(request, { params }) {
  return formService.getFormVersionByNum(request, params);
}
