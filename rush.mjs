//console.log("hi");

import Slack from "@slack/bolt";
import dotenv from "dotenv";

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

await app.client.users
  .info({
    token: process.env.SLACK_BOT_TOKEN,
    user: process.env.SLACK_USER_ID,
  })
  .then((result) => {
    console.log(result.user.profile.status_text);
  });
