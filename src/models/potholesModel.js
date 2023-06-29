import { ObjectId } from "mongodb";
import { connectToMongoDB } from "../services/mongoService.js";

export async function createPothole(pothole) {
  const database = await connectToMongoDB();
  const potholesCollection = database.collection("potholes");

  const result = await potholesCollection.insertOne(pothole);
  const createdPothole = { ...pothole, _id: result.insertedId };

  return createdPothole;
}

export async function getAllPotholes() {
  const database = await connectToMongoDB();
  const potholesCollection = database.collection("potholes");

  const potholes = potholesCollection.find().toArray();

  return potholes;
}

export async function getPotholesByUserId(userId) {
  const database = await connectToMongoDB();
  const potholesCollection = database.collection("potholes");

  const pothole = await potholesCollection.find({
    userId: new ObjectId(userId),
  });

  return pothole;
}

export async function getPotholeById(potholeId) {
  const database = await connectToMongoDB();
  const potholesCollection = database.collection("potholes");

  const pothole = await potholesCollection.findOne({
    _id: new ObjectId(potholeId),
  });

  return pothole;
}

export async function updatePotholeById(potholeId, updatedPothole) {
  const database = await connectToMongoDB();
  const potholesCollection = database.collection("potholes");

  const result = await potholesCollection.findOneAndUpdate(
    { _id: new ObjectId(potholeId) },
    { $set: updatedPothole },
    { returnDocument: "after" } // Returns the updated Profile
  );

  return result.value;
}

export async function deletePotholeById(potholeId) {
  const database = await connectToMongoDB();
  const potholesCollection = database.collection("potholes");

  const result = await potholesCollection.findOneAndDelete(
    { _id: new ObjectId(potholeId) },
    { returnDocument: "after" } // Returns the deleted Profile
  );

  return result.value;
}
