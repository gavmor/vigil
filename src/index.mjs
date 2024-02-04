import dotenv from "dotenv";

import { fetchStatus, fetchMessages } from "./slackData.mjs";

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

async function getUserInfo() {
  const result = await timestampCollection.findOne({ _id: "1" });
  return result;
}

async function updateUserStatus(newStatus) {
  const result = await timestampCollection.updateOne(
    { _id: "1" },
    { $set: { userStatus: newStatus } }
  );
  return result;
}

function getLatestMessages(messageHistory, lastTimestamp) {
  console.log(`Last timestamp: ${lastTimestamp}\n`);
  const comparisonTimestamp = new Date(lastTimestamp);
  const newMessages = messageHistory.filter(({ localTimestamp }) => {
    const messageDate = new Date(localTimestamp);
    return messageDate > comparisonTimestamp;
  });
  return newMessages;
}

async function testingPromise() {
  let user = await getUserInfo();
  let currentStatus = await fetchStatus();
  let lastActivity = user.lastActivity;

  if (user.userStatus !== currentStatus) {
    console.log("User status has changed");
    await updateUserStatus(currentStatus).then((result) => {
      console.log(result);
      console.log("User status updated\n");
    });
  } else {
    console.log("User status has not changed\n");
  }

  let messages = await fetchMessages();
  const latestMessages = getLatestMessages(messages, lastActivity);
  console.log(latestMessages.length + "\n");
  if (latestMessages.length > 0) {
    console.log("New messages found");
    const documents = latestMessages.map(({ text, localTimestamp }) => {
      return {
        message: text,
        timestamp: localTimestamp,
      };
    });
    console.log(documents);
    const latestMessage = documents.reduce((latest, current) => {
      const currentTimestamp = new Date(current.localTimestamp);
      const latestTimestamp = new Date(latest.localTimestamp);

      return currentTimestamp > latestTimestamp ? current : latest;
    });

    console.log(latestMessage.timestamp);
  }
}

testingPromise();
