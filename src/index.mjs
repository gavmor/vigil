import dotenv from "dotenv";

import { fetchStatus } from "./slackData.mjs";

dotenv.config();
const chatCollectionName = process.env.ASTRA_COLLECTION_NAME;
const timestampCollectionName = process.env.RUSH_ASTRA_COLLECTION_NAME;
import {
  chatDBConnections,
  timestampDBConnections,
} from "./databaseConnection.mjs";

const timestampData = timestampDBConnections();
const chatData = chatDBConnections();

const timestampCollection = await timestampData.collection(
  timestampCollectionName
);
const chatCollection = await chatData.collection(chatCollectionName);

// console.log(timestampCollection);
// console.log(chatCollection);

fetchStatus().then((status) => {
  console.log(status);
});
