import prismaClient from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import ApiResponse from "../utils/ApiResponse.js";

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15d" });
};

const registerUser = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    // Registration logic here
    if (!email.trim()) throw new Error("Please enter an email");
    if (!password.trim()) throw new Error("Please enter a password");
    if (!name.trim()) throw new Error("Please enter a name");

    const dbUser = await prismaClient.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    if (dbUser) throw new Error("user already exists, kindly log in!");
    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await prismaClient.user.create({
      data: { email, password: hashedPassword, name },
      select: { id: true, name: true, email: true },
    });
    if (!createdUser) throw new Error("User not created");

    return res
      .status(200)
      .json(new ApiResponse(200, "User created", createdUser));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, error.message || "Internal Server Error", null)
      );
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email.trim()) throw new Error("Please enter an email");
    if (!password.trim()) throw new Error("Please enter a password");

    const dbUser = await prismaClient.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });

    if (!dbUser) throw new Error("User not found, kindly register");

    const isPasswordValid = await bcrypt.compare(password, dbUser.password);
    if (!isPasswordValid) throw new Error("Invalid password");

    const accessToken = generateAccessToken({
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
    });
    if (!accessToken) throw new Error("Token not generated");

    return res
      .status(200)
      .cookie("token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Only true in production
        sameSite: "strict", // Prevents CSRF attacks
        maxAge: 1000 * 60 * 60 * 24 * 15, // 15 days expiration
      })
      .json(
        new ApiResponse(200, "User logged in", {
          accessToken,
          user: { id: dbUser.id, name: dbUser.name, email: dbUser.email },
        })
      );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, error.message || "Internal Server Error", null)
      );
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = req.user.id;
    if (!user) throw new Error("User not found");
    const dbUser = await prismaClient.user.findUnique({
      where: { id: user },
      select: { id: true, name: true, email: true },
    });

    if (!dbUser) throw new Error("User not found");
    const getUser = await prismaClient.user.findUnique({
      where: { id: user },
      // include: {
      //   communities: true,
      //   communityParticipant: true,
      //   todos: true,
      // },
      select: {
        id: true,
        name: true,
        email: true,
        notionToken: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!getUser) throw new Error("User not found");

    return res.status(200).json(new ApiResponse(200, "User found", getUser));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, error.message || "Internal Server Error", null)
      );
  }
};

const resetPassword = async (req, res) => {
  try {
    const user = req.user.id;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword.trim()) throw new Error("Please enter your old password");
    if (!newPassword.trim()) throw new Error("Please enter a new password");

    const dbUser = await prismaClient.user.findUnique({
      where: { id: user },
      select: { id: true, name: true, email: true, password: true },
    });
    if (!dbUser) throw new Error("User not found");

    const isPasswordValid = await bcrypt.compare(oldPassword, dbUser.password);
    if (!isPasswordValid) throw new Error("Invalid password");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await prismaClient.user.update({
      where: { id: user },
      data: { password: hashedPassword },
      select: { id: true, name: true, email: true },
    });
    if (!updatedUser) throw new Error("Password not updated");

    return res
      .status(200)
      .json(new ApiResponse(200, "Password updated", updatedUser));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, error.message || "Internal Server Error", null)
      );
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = req.user.id;
    const { name } = req.body;
    if (!name.trim()) throw new Error("Please enter a name");

    const dbUser = await prismaClient.user.findUnique({
      where: { id: user },
      select: { id: true, name: true, email: true },
    });
    if (!dbUser) throw new Error("User not found");

    const updatedUser = await prismaClient.user.update({
      where: { id: user },
      data: { name },
      select: { id: true, name: true, email: true },
    });
    if (!updatedUser) throw new Error("User not updated");

    return res
      .status(200)
      .json(new ApiResponse(200, "User updated", updatedUser));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, error.message || "Internal Server Error", null)
      );
  }
};

const updateUserProfileImage = async (req, res) => {};
const updateNotionToken = async (req, res) => {};

export {
  registerUser,
  loginUser,
  getUserProfile,
  resetPassword,
  updateUserProfile,
};
