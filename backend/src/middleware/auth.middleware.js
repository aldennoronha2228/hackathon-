import jwt from "jsonwebtoken";
import { findUserById } from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const user = await findUserById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove password before attaching to request
    const { password, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;

    next();
  } catch (error) {
    if (error?.name === "JsonWebTokenError" || error?.name === "TokenExpiredError") {
      console.debug("[auth] token validation failed:", error.message);
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};