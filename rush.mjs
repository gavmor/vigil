//console.log("hi");
import { ContextChatEngine } from "llamaindex";
import Slack from "@slack/bolt";
import dotenv from "dotenv";
import { fetchStatus } from "./fetchStatus.mjs";
import { fetchMessages } from "./fetchMessages.mjs";
import { init } from "./src/rag.mjs";

dotenv.config();

// const app = new Slack.App({
//   signingSecret: process.env.SLACK_SIGNING_SECRET,
//   token: process.env.SLACK_BOT_TOKEN,
// });

// function getChatMessages() {
//   fetchMessages().then((messages) => {
//     console.log(messages);
//   });
// }

// function getUserStatus() {
//   fetchStatus().then((status) => {
//     console.log(status);
//   });
// }

// setInterval(getUserStatus, 5000);
// //setInterval(getChatMessages, 7000);
