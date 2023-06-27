// import jwt from "jsonwebtoken";
// import Joi from "joi";

// const verifyAuthSchema = Joi.object({
//   authorization: Joi.string().required(),
// }).unknown();

// const customUnauthorizedError = (res, message) => {
//   return res.status(401).json({ message });
// };

// const verifyAuth = (req, res, next) => {
//   try {
//     // const { error, value } = verifyAuthSchema.validate(req.headers);
//     // if (error) {
//     //   throw new Error(error.message);
//     // }
//     const token = value.authorization.slice(7);
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     if (err.name === "JsonWebTokenError") {
//       return res.status(401).json({message: "Invalid token"});
//       // return customUnauthorizedError(res, "Invalid token");
//     }
//     if (err.name === "TokenExpiredError") {
//       return res.status(401).json({message: "Token expired"});
//       // return customUnauthorizedError(res, "Token expired");
//     }
//     throw err;
//   }
// };

// export default verifyAuth;


import jwt from "jsonwebtoken";

const customUnauthorizedError = (res, message) => {
  return res.status(401).json({ message });
};
// test
const verifyAuth = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return customUnauthorizedError(res, "Invalid authorization header");
    }
    const token = authorizationHeader.slice(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return customUnauthorizedError(res, "Invalid token");
    }
    if (err.name === "TokenExpiredError") {
      return customUnauthorizedError(res, "Token expired");
    }
    throw err;
  }
};

export default verifyAuth;
