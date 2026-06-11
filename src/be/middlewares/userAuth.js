export function userAuth(user, roles = []) {
    if (!roles.includes(user.role)) {
        throw new Error("Forbidden");
    }
}
