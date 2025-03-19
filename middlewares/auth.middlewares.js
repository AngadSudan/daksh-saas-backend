import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
const verfiyJWT = async (req, res, next) => {
  const token =
    req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res
      .status(200)
      .json(new ApiResponse(500, "No user token found, relogin", null));
  }
  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  // console.log("decoded token is ", decodedToken);
  if (!decodedToken)
    return res.status(200).json(new ApiResponse(500, "invalid token", null));

  // const user = await prismaClient.user.findUnique({
  //   where: { id: decodedToken.id },
  //   select: { id: true, name: true, email: true },
  // });
  // console.log(user);
  // if (!user)
  //   return res.status(200).json(new ApiResponse(500, "No user found", null));
  req.user = decodedToken;

  next();
};

export default verfiyJWT;
