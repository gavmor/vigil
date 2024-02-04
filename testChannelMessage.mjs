import Slack from "@slack/bolt";
import dotenv from "dotenv";
import moment from "moment";

dotenv.config();

const app = new Slack.App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
});

const result = await app.client.conversations.history({
  token: process.env.SLACK_BOT_TOKEN,
  channel: process.env.SLACK_CHANNEL_ID,
});

const apiResponse = result.messages;
const messagesWithClientMsgId = apiResponse.filter(
  (message) => message.client_msg_id
);

// Extract the text and ts fields
const extractedData = messagesWithClientMsgId.map(({ text, ts }) => {
  const localTimestamp = new Date(parseFloat(ts) * 1000).toLocaleString();
  return { text, localTimestamp };
});

console.log(extractedData);

const comparisonTimestamp = new Date("2/3/2024, 12:15:30 PM");

const newMessages = extractedData.filter(({ localTimestamp }) => {
  const messageDate = new Date(localTimestamp);
  return messageDate > comparisonTimestamp;
});

console.log(newMessages);
