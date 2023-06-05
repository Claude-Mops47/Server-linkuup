import jwt from "jsonwebtoken";

const verifyAuth = (req, res, next) => {
  // Get the JWT token from the request header.
  const token = req.headers["authorization"];
  // If there is no JWT token, return an unauthorized error.
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided. Access denied.",
    });
  }

  try {
    const decoded = jwt.verify(
      // token.replace("Bearer ", ""),
      token.slice(7),
      process.env.JWT_SECRET
    );
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Invalid token. Access denied.",
    });
  }
};
export   default verifyAuth