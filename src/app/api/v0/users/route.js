import UserService from "../../../../be/services/UserService";

const userService = new UserService();

export async function POST(request) {
    return userService.createUser(request);
}

export async function GET(request) {
    return userService.getUsers(request);
}
