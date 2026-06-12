import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import User from "../models/User";
import { connectDB } from "../config/db";

import { loginAuth } from "../middlewares/loginAuth";
import { userAuth } from "../middlewares/userAuth";

class UserService {
  async createUser(request) {
    await connectDB();
    try {
      const currentUser = await loginAuth(request);

      userAuth(currentUser, ["owner"]);

      const body = await request.json();

      const { firstName, lastName, email, password } = body;

      const existingUser = await User.findOne({
        email,
      });

      if (existingUser) {
        return NextResponse.json(
          {
            success: false,
            message: "Email already exists",
          },
          {
            status: 400,
          },
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        companyId: currentUser.companyId,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: "user",
      });

      const userResponse = user.toObject();

      delete userResponse.password;

      return NextResponse.json(
        {
          success: true,
          user: userResponse,
        },
        {
          status: 201,
        },
      );
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: 500,
        },
      );
    }
  }

  async getUsers(request) {
    try {
      const currentUser = await loginAuth(request);

      userAuth(currentUser, ["owner"]);

      const users = await User.find({
        companyId: currentUser.companyId,
      }).select("-password");

      return NextResponse.json({
        success: true,
        users,
      });
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: 500,
        },
      );
    }
  }

  async getUserById(request, params) {
    try {
      const currentUser = await loginAuth(request);

      const { id } = await params;

      const user = await User.findOne({
        _id: id,
        companyId: currentUser.companyId,
      }).select("-password");

      if (!user) {
        return NextResponse.json(
          {
            success: false,
            message: "User not found",
          },
          {
            status: 404,
          },
        );
      }

      return NextResponse.json({
        success: true,
        user,
      });
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: 500,
        },
      );
    }
  }

  async updateUser(request, params) {
    try {
      const currentUser = await loginAuth(request);

      const { id } = await params;

      const body = await request.json();

      const user = await User.findOne({
        _id: id,
        companyId: currentUser.companyId,
      });

      if (!user) {
        return NextResponse.json(
          {
            success: false,
            message: "User not found",
          },
          {
            status: 404,
          },
        );
      }

      Object.assign(user, body);

      await user.save();

      return NextResponse.json({
        success: true,
        user,
      });
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: 500,
        },
      );
    }
  }

  async deactivateUser(request, params) {
    try {
      const currentUser = await loginAuth(request);

      const { id } = await params;

      const user = await User.findOne({
        _id: id,
        companyId: currentUser.companyId,
      });

      if (!user) {
        return NextResponse.json(
          {
            success: false,
            message: "User not found",
          },
          {
            status: 404,
          },
        );
      }

      user.isActive = false;

      await user.save();

      return NextResponse.json({
        success: true,
        message: "User deactivated successfully",
      });
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: 500,
        },
      );
    }
  }
}

export default UserService;
