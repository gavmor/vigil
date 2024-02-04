// import { App } from "@slack/bolt";
// import { ingest } from "./rag";
import dotenv from "dotenv";
import { config } from "dotenv";

config();
console.log(process.env.RUSH_ASTRA_API_ENDPOINT);

import {
  chatDBConnections,
  timestampDBConnections,
} from "./databaseConnection";

// const app = new App({
//   signingSecret: process.env.SLACK_SIGNING_SECRET,
//   token: process.env.SLACK_BOT_TOKEN,
// });

// /* Add functionality here */

// (async () => {
//   // Start the app
//   await app.start(process.env.PORT || 1337);
//   app.message(/.*/, async (messageEvent) => ingest(messageEvent));

//   console.log("⚡️ Bolt app is running!");
// })();

const data = timestampDBConnections();
