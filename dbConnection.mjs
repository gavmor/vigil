import { AstraDB } from "@datastax/astra-db-ts";
import dotenv from "dotenv";
dotenv.config();

const db = new AstraDB(
  process.env.RUSH_ASTRA_APP_TOKEN,
  process.env.RUSH_ASTRA_API_ENDPOINT
);

// Create a collection
// await db.createCollection("vector_test", {
//   vector: {
//     dimension: 5,
//     metric: "cosine",
//   },
// });

const collection = await db.collection("vector_test");
//console.log(collection);

const documents = [
  {
    _id: "1",
    lastActivity: "2/3/2024, 12:15:39 PM",
    userStatus: "I'm busy",
  },
];

// const results = await collection.insertMany(documents);

// const data = await collection.deleteOne({ _id: "1" });
const data = await collection.findOne({ _id: "1" });
console.log(data);
