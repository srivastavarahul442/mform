import AuthService from "../../../../../be/services/AuthService";

const authService = new AuthService();

export async function GET(request) {
    return authService.me(request);
}
