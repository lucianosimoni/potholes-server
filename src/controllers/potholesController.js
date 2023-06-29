import { ObjectId } from "bson";
import {
  createPothole,
  getAllPotholes,
  getPotholeById,
  getPotholesByUserId,
  updatePotholeById,
  deletePotholeById,
} from "../models/potholesModel.js";
import {
  missingBody,
  missingParams,
  potholeIdNotFound,
  potholesUserIdNotFound,
} from "../utils/responseUtils.js";

export async function potholeCreate(req, res) {
  const pothole = req.body;

  if (
    !pothole.userId ||
    !pothole.title ||
    !pothole.description ||
    !(pothole.images instanceof Array) ||
    !(pothole.position instanceof Object)
  ) {
    return missingBody(res);
  }

  pothole.userId = new ObjectId(pothole.userId);

  try {
    const createdPothole = await createPothole(pothole);
    if (!createdPothole) {
      console.log(
        "⚠️🟠 there is no createdPothole object. Object is:",
        createdPothole
      );
      throw new Error(createdPothole);
    }
    return res.status(201).json({ createdPothole });
  } catch (error) {
    // MongoDB Duplicate Key Error
    if (error.code == 11000) {
      return somethingInUse(res, error);
    }
    console.log("⚠️🔴 An error occurred while creating Pothole by UserId.");
    res
      .status(500)
      .json({ error: "An error occurred while updating Pothole by UserId." });
  }
}

export async function potholeGet(req, res) {
  const { userId, potholeId } = req.query;

  if (userId) {
    try {
      const pothole = await getPotholesByUserId(userId);
      if (!pothole) {
        return potholesUserIdNotFound(res);
      }
      return res.status(200).json({ pothole });
    } catch (error) {
      console.log("⚠️🔴 An error occurred while getting Pothole by UserId.");
      res
        .status(500)
        .json({ error: "An error occurred while getting Pothole by UserId." });
    }
    return;
  }

  if (potholeId) {
    try {
      const pothole = await getPotholeById(potholeId);
      if (!pothole) {
        return potholeIdNotFound(res);
      }
      return res.status(200).json({ pothole });
    } catch (error) {
      console.log("⚠️🔴 An error occurred while getting Pothole by id.");
      res
        .status(500)
        .json({ error: "An error occurred while getting Pothole by id." });
    }
    return;
  }

  // Return all the Potholes
  try {
    const potholes = await getAllPotholes();
    return res.json({ potholes });
  } catch (error) {
    console.log("⚠️🔴 An error occurred while getting all Potholes.");
    res
      .status(500)
      .json({ error: "An error occurred while getting all Potholes." });
  }
}

export async function potholeUpdate(req, res) {
  const { potholeId } = req.params;
  const pothole = req.body;

  if (!potholeId) {
    return missingParams(res);
  }
  if (!Object.keys(pothole).length) {
    return missingBody(res);
  }

  try {
    const updatedPothole = await updatePotholeById(potholeId, pothole);
    if (!updatedPothole) {
      return potholeIdNotFound(res);
    }
    return res.status(201).json({ updatedPothole });
  } catch (error) {
    console.log("⚠️🔴 An error occurred while getting Pothole by UserId.");
    res
      .status(500)
      .json({ error: "An error occurred while updating Pothole by UserId." });
  }
}

export async function potholeDelete(req, res) {
  const { userId } = req.params;

  if (!userId) {
    return missingParams(res);
  }

  try {
    const deletedProfile = await deletePotholeById(userId);
    if (!deletedProfile) {
      return potholeIdNotFound(res);
    }
    return res.status(201).json({ deletedProfile });
  } catch (error) {
    console.log("⚠️🔴 An error occurred while getting Pothole by UserId.");
    res
      .status(500)
      .json({ error: "An error occurred while updating pothole by UserId." });
  }
}
