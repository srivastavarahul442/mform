import ApiKeyService from "../../../../../../../be/services/ApiKeyService";

const apiKeyService = new ApiKeyService();

/**
 * POST /api/external/v0/forms/[id]/invites
 *
 * Generates a unique invite link for a form.
 * Authentication: x-api-key header or Authorization: Bearer <key>
 *
 * Body:
 * {
 *   "name": "Lead Name",    // optional
 *   "phone": "9876543210",  // required
 *   "email": "lead@example.com" // optional
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "url": "https://yourapp.com/f/[formId]?token=...",
 *   "token": "...",
 *   "invite": { ... }
 * }
 */
export async function POST(request, { params }) {
  return apiKeyService.generateExternalInvite(request, params);
}
