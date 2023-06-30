import jwt from "jsonwebtoken";

const customUnauthorizedError = (res, message) => {
  return res.status(401).json({ message });
};

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
