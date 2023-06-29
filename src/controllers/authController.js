import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, getUserByUsername } from "../models/userModel.js";
import {
  invalidAuth,
  invalidUsernameOrPassword,
  invalidPasswordLength,
  missingAuth,
  missingBody,
  missingToken,
  somethingInUse,
  usernameInUse,
} from "../utils/responseUtils.js";

export async function userLogin(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return missingBody(res);
  }

  const user = await getUserByUsername(username);
  if (!user) {
    return invalidUsernameOrPassword(res);
  }

  const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
  if (!isPasswordValid) {
    return invalidUsernameOrPassword(res);
  }
  delete user.hashedPassword;

  const token = jwt.sign({ username }, process.env.JWT_PRIVATE_KEY);
  const loggedUser = { ...user, token };

  return res.status(200).json({ loggedUser });
}

export async function userRegister(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return missingBody(res);
  }
  if (password.length < 6) {
    return invalidPasswordLength(res);
  }

  const hashedPassword = await bcrypt.hash(password, 15);
  const user = { username, hashedPassword };

  try {
    const registeredUser = await createUser(user);
    delete registeredUser.hashedPassword;
    const token = jwt.sign({ username }, process.env.JWT_PRIVATE_KEY);
    return res
      .status(201)
      .json({ registeredUser: { ...registeredUser, token } });
  } catch (error) {
    // MongoDB Duplicate Key Error
    if (error.code == 11000) {
      switch (Object.keys(error.keyPattern)[0]) {
        case "username":
          return usernameInUse(res);
        default: // Handle unexpected key pattern
          return somethingInUse(res, error);
      }
    }
    console.log(
      "🔴 An unexpected Error happened while Registering the User (authController.js / userRegister)"
    );
    res.status(500).json(error);
  }
}

export function jwtCheck(req, res) {
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
    return res.status(200).json({ ok: true });
  } catch (error) {
    return invalidAuth(res);
  }
}
