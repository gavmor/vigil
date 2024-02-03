//console.log("hi");

import Slack from "@slack/bolt";
import dotenv from "dotenv";
import { fetchStatus } from "./fetchStatus.mjs";

dotenv.config();

const app = new Slack.App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
});

await app.client.conversations
  .history({
    token: process.env.SLACK_BOT_TOKEN,
    channel: process.env.SLACK_CHANNEL_ID,
  })
  .then((result) => {
    //console.log(result.messages);
  });

function getData() {
  fetchStatus().then((status) => {
    console.log(status);
  });
}

setInterval(getData, 5000);
