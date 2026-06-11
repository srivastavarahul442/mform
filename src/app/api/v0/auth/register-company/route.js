import AuthService from "../../../../../be/services/AuthService";

const authService = new AuthService();

export async function POST(request) {
    return authService.registerCompany(request);
}