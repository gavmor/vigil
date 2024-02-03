import Slack from "@slack/bolt";
import dotenv from "dotenv";
import { fetchStatus } from "./fetchStatus.mjs";

dotenv.config();

const app = new Slack.App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
});

export async function fetchMessages() {
  const result = await app.client.conversations.history({
    token: process.env.SLACK_BOT_TOKEN,
    channel: process.env.SLACK_CHANNEL_ID,
  });
  return result.messages;
}
