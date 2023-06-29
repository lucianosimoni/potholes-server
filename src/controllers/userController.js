import {
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../models/userModel.js";
import {
  missingBody,
  missingParams,
  userIdNotFound,
} from "../utils/responseUtils.js";

// 🟢 User Creation is in the authController.js

export async function userGet(req, res) {
  const { userId } = req.query;

  if (userId) {
    try {
      const user = await getUserById(userId);
      if (!user) {
        return userIdNotFound(res);
      }
      delete user.hashedPassword;
      return res.status(200).json({ user });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while getting user by id." });
    }
    return;
  }

  // Return all users
  try {
    const users = await getAllUsers();
    // TODO: Should not return hashedPasswords!
    return res.json({ users });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while getting all users." });
  }
}

export async function userUpdate(req, res) {
  const { userId } = req.params;
  const user = req.body;

  if (!userId) {
    return missingParams(res);
  }
  if (!user) {
    return missingBody(res);
  }

  // TODO: Check if there is no new keys being added into this update

  try {
    const updatedUser = await updateUser(userId, user);
    if (!updatedUser) {
      return userIdNotFound(res);
    }
    delete updatedUser.hashedPassword;
    return res.status(201).json({ updatedUser });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating user by its id." });
  }
}

export async function userDelete(req, res) {
  const { userId } = req.params;

  if (!userId) {
    return missingParams(res);
  }

  try {
    const deletedUser = await deleteUser(userId);
    if (!deletedUser) {
      return userIdNotFound(res);
    }
    delete deletedUser.hashedPassword;
    return res.status(201).json({ deletedUser });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating user by its id." });
  }
}
