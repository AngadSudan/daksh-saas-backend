import primsaClient from "../utils/db.js";
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
    // Login logic here
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
    // Get user profile logic here
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
    // Reset password logic here
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
    // Update user profile logic here
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, error.message || "Internal Server Error", null)
      );
  }
};

export {
  registerUser,
  loginUser,
  getUserProfile,
  resetPassword,
  updateUserProfile,
};
