import ApiKeyService from "../../../../../../../../be/services/ApiKeyService";

const apiKeyService = new ApiKeyService();

/**
 * GET /api/external/v0/forms/[id]/invites/[token]
 *
 * Fetches the invite status and the linked submission (if completed) for a given token.
 * Authentication: x-api-key header or Authorization: Bearer <key>
 *
 * Response:
 * {
 *   "success": true,
 *   "invite": { "token": "...", "status": "completed" | "pending", "targetUser": { ... } },
 *   "submission": {            // only present when status === "completed"
 *     "_id": "...",
 *     "submittedAt": "...",
 *     "submittedBy": { name, phone, email },
 *     "answers": [ { "fieldLabel": "Property", "value": "mm" }, ... ]
 *   }
 * }
 */
export async function GET(request, { params }) {
  return apiKeyService.getExternalInviteSubmission(request, params);
}
