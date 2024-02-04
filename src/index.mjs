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
  const userData = await timestampCollection.findOne({ _id: "1" });
  const documents = [
    {
      _id: "1",
      lastActivity: userData.lastActivity,
      userStatus: newStatus,
    },
  ];
  await timestampCollection.deleteOne({ _id: "1" });
  const results = await timestampCollection.insertMany(documents);
  return results;
}

function getLatestMessages(messageHistory, lastTimestamp) {
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
      console.log("User status updated");
    });
  } else {
    console.log("User status has not changed");
  }

  let messages = await fetchMessages();
  let latestMessages = getLatestMessages(messages, lastActivity);
  console.log(latestMessages);
}

testingPromise();
