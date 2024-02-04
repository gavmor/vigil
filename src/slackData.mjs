import Slack from "@slack/bolt";
import dotenv from "dotenv";

dotenv.config();

const app = new Slack.App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
});

export async function fetchStatus() {
  const result = await app.client.users.info({
    token: process.env.SLACK_BOT_TOKEN,
    user: process.env.SLACK_USER_ID,
  });
  return result.user.profile.status_text;
}
