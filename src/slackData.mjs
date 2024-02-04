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

export async function fetchMessages() {
  const result = await app.client.conversations.history({
    token: process.env.SLACK_BOT_TOKEN,
    channel: process.env.SLACK_CHANNEL_ID,
  });
  const apiResponse = result.messages;
  const messagesWithClientMsgId = apiResponse.filter(
    (message) => message.client_msg_id
  );
  const extractedData = messagesWithClientMsgId.map(({ text, ts }) => {
    const localTimestamp = new Date(parseFloat(ts) * 1000).toLocaleString();
    return { text, localTimestamp };
  });

  return extractedData;
}
