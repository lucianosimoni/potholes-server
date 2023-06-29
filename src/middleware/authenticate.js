import {
  invalidAuth,
  missingAuth,
  missingToken,
} from "../utils/responseUtils.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return missingAuth(res);
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return missingToken(res);
  }

  try {
    jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    next();
  } catch (error) {
    return invalidAuth(res);
  }
}
