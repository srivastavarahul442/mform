import ApiKeyService from "../../../../../../be/services/ApiKeyService";

const apiKeyService = new ApiKeyService();

export async function DELETE(request, { params }) {
  return apiKeyService.revokeApiKey(request, params);
}
