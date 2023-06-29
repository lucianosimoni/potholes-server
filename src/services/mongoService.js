import dotenv from "dotenv";
import { MongoClient } from "mongodb";
dotenv.config();

const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER_URL}`;

let client;

export async function connectToMongoDB() {
  if (!client) {
    console.log("🟡 Connecting to Database");
    client = new MongoClient(uri, {
      appName: "NodeJS Server",
      maxPoolSize: 100,
      retryWrites: true,
      writeConcern: "majority",
    });
    await client.connect();
    console.log("🟢 Connected. Client URL is: ", client.s.url);
  }
  const dbName = process.env.MONGODB_DATABASE_NAME;
  const database = client.db(dbName);
  return database;
}
