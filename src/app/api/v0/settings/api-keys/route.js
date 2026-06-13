import ApiKeyService from "../../../../../be/services/ApiKeyService";

const apiKeyService = new ApiKeyService();

export async function GET(request) {
  return apiKeyService.listApiKeys(request);
}

export async function POST(request) {
  return apiKeyService.createApiKey(request);
}
