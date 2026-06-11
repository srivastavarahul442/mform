import UserService from "../../../../../be/services/UserService";

const userService = new UserService();

export async function GET(request, { params }) {
  return userService.getUserById(request, params);
}

export async function PATCH(request, { params }) {
  return userService.updateUser(request, params);
}

export async function DELETE(request, { params }) {
  return userService.deactivateUser(request, params);
}
