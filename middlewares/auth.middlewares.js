import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
const verfiyJWT = async (req, res, next) => {
  console.log("cookies are ", req.cookies);
  const token =
    req.cookies.token ||
    req.header("Authorization")?.replace("Bearer ", "") ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYzNzk5NjI2LWJhNjctNDQ3OS05YzNmLTBmMDA3MjlhNDdiNiIsIm5hbWUiOiJhbmdhZCIsImVtYWlsIjoiYW5nYWRAZ21haWwuY29tIiwiaWF0IjoxNzQzMDUwMzk5LCJleHAiOjE3NDQzNDYzOTl9.eejxUUeKJf4bD3voTjHBsdJeDh3eUdnHVBiSQrmkTZY";
  // if (!token) {
  //   return res
  //     .status(200)
  //     .json(new ApiResponse(500, "No user token found, relogin", null));
  // }
  // const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  // console.log("decoded token is ", decodedToken);
  // if (!decodedToken)
  //   return res.status(200).json(new ApiResponse(500, "invalid token", null));

  // const user = await prismaClient.user.findUnique({
  //   where: { id: decodedToken.id },
  //   select: { id: true, name: true, email: true },
  // });
  // console.log(user);
  // if (!user)
  //   return res.status(200).json(new ApiResponse(500, "No user found", null));
  // req.user = decodedToken;
  req.user = {
    id: "f3799626-ba67-4479-9c3f-0f00729a47b6",
  };

  next();
};

export default verfiyJWT;
