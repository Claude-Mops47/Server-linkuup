// import jwt from "jsonwebtoken";

// const verifyAuth = (req, res, next) => {
//   // Get the JWT token from the request header.
//   const token = req.headers["authorization"];
//   // If there is no JWT token, return an unauthorized error.
//   if (!token) {
//     return res.status(401).json({
//       success: false,
//       message: "No token provided. Access denied.",
//     });
//   }

//   try {
//     const decoded = jwt.verify(
//       // token.replace("Bearer ", ""),
//       token.slice(7),
//       process.env.JWT_SECRET
//     );
//     req.user = decoded;
//     next();
//   } catch (err) {
//     res.status(401).json({
//       success: false,
//       message: "Invalid token. Access denied.",
//     });
//   }
// };
// export default verifyAuth;



import jwt from "jsonwebtoken";
import Boom from 'boom';
import Joi from "joi";

const verifyAuthSchema = Joi.object({
  authorization: Joi.string().required(),
}).unknown();

const customUnauthorizedError = (message) => {
  return Boom.unauthorized(message, 'CustomUnauthorized');
};

const verifyAuth = (req, res, next) => {
  try {
    const { error, value } = verifyAuthSchema.validate(req.headers);
    if (error) {
      throw Boom.badRequest(error.message);
    }
    const token = value.authorization.slice(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("ERR", err.name);
    if (err.name === "JsonWebTokenError") {
      throw customUnauthorizedError("Invalid token");
    }
    if (err.name === "TokenExpiredError") {
      throw customUnauthorizedError("Token expired");
    }
    throw err;
  }
};

export default verifyAuth;
