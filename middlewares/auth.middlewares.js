import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
const verfiyJWT = async (req, res, next) => {
  // console.log("cookies are ", req.headers);
  // console.log("headers are ", req.headers);
  try {
    const token =
      req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
    // console.log(token);
    if (!token) {
      return res
        .status(200)
        .json(new ApiResponse(500, "No user token found, relogin", null));
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // console.log("decoded token is ", decodedToken);
    if (!decodedToken)
      return res.status(200).json(new ApiResponse(500, "invalid token", null));

    req.user = decodedToken;
    next();
  } catch (error) {
    return res
      .status(200)
      .json(new ApiResponse(500, "kindly signout and relogin", null));
  }
};

export default verfiyJWT;
