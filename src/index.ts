import { App } from "@slack/bolt";
import { ingest } from "./rag";

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
});

/* Add functionality here */

(async () => {
  // Start the app
  await app.start(process.env.PORT || 1337);
  app.message(/.*/, async (messageEvent) => ingest(messageEvent));

  console.log("⚡️ Bolt app is running!");
})();
