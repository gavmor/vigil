import dotenv from "dotenv";
import {
  Document,
  VectorStoreIndex,
  AstraDBVectorStore,
  Ollama,
  serviceContextFromDefaults,
  storageContextFromDefaults,
} from "llamaindex";
import { ingest, init, query } from "./rag.mjs";
import { fetchStatus, fetchMessages, postMessage } from "./slackData.mjs";

import {
  chatDBConnections,
  timestampDBConnections,
  astra,
} from "./databaseConnection.mjs";

dotenv.config();

const chatCollectionName = process.env.ASTRA_COLLECTION_NAME;
const timestampCollectionName = process.env.RUSH_ASTRA_COLLECTION_NAME;
const timestampData = timestampDBConnections();
const chatData = chatDBConnections();

const timestampCollection = await timestampData.collection(
  timestampCollectionName
);
const chatCollection = await chatData.collection(chatCollectionName);

async function getUserInfo() {
  const result = await timestampCollection.findOne({ _id: "1" });
  return result;
}

async function updateUserStatus(newStatus) {
  const result = await timestampCollection.updateOne(
    { _id: "1" },
    { $set: { userStatus: newStatus } }
  );
  console.log(result);
  return result;
}

async function updateLastActivity(newlastActivity) {
  console.log(newlastActivity);
  const result = await timestampCollection.updateOne(
    { _id: "1" },
    { $set: { lastActivity: newlastActivity } }
  );
  console.log(result);
  return result;
}

function getLatestMessages(messageHistory, lastTimestamp) {
  console.log(`Last timestamp: ${lastTimestamp}\n`);
  let comparisonTimestamp;
  if (lastTimestamp === null) {
    comparisonTimestamp = new Date("2/3/2024, 12:15:18 PM");
  }
  const newMessages = messageHistory.filter(({ localTimestamp }) => {
    const messageDate = new Date(localTimestamp);
    return messageDate > comparisonTimestamp;
  });

  return newMessages;
}

async function statusUpdate(user, currentStatus) {
  if (user.userStatus !== currentStatus) {
    console.log("User status has changed");
    await updateUserStatus(currentStatus).then((result) => {
      console.log(result);
      console.log("User status updated\n");
    });
  } else {
    console.log("User status has not changed\n");
  }
}

async function chatUpdate(user) {
  let lastActivity = user.lastActivity;
  let documents = [];
  let latestMessage = {};

  let messages = await fetchMessages();
  const latestMessages = getLatestMessages(messages, lastActivity);

  console.log(latestMessages.length + "\n");
  if (latestMessages.length > 0) {
    documents = latestMessages.map(({ text, localTimestamp }) => {
      return {
        message: text,
        timestamp: localTimestamp,
      };
    });
    //console.log(documents);
    latestMessage = documents.reduce((latest, current) => {
      const currentTimestamp = new Date(current.localTimestamp);
      const latestTimestamp = new Date(latest.localTimestamp);

      return currentTimestamp > latestTimestamp ? current : latest;
    });

    await updateLastActivity(latestMessage.localTimestamp);
  }

  return { documents, latestMessage };
}

let user = await getUserInfo();
let currentStatus = await fetchStatus();

statusUpdate(user, currentStatus);
let newMessages = await chatUpdate(user);

let messages = newMessages.documents;

let newDocument = messages.map((messages) => messages.message);

// console.log(newDocument);

// init()
ingest(newDocument)
  .then(() => query(currentStatus))
  .then(({ response }) => {
    if (
      response.toLocaleLowerCase().includes("empty response") ||
      response
        .toLocaleLowerCase()
        .includes("here is not enough information provided")
    ) {
      console.log(" No new messages");
      postMessage("No new messages");
    } else {
      console.log(response);
      postMessage(response);
    }
  });
