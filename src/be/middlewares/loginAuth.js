import jwt from "jsonwebtoken";
import User from "../models/User";

export async function loginAuth(request) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.userId).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}
