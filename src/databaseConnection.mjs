import { AstraDB } from "@datastax/astra-db-ts";
import { AstraDBVectorStore } from "llamaindex";
import dotenv from "dotenv";
dotenv.config();

export function chatDBConnections() {
  const chatDB = new AstraDB(
    process.env.RUSH_ASTRA_APP_TOKEN,
    process.env.RUSH_ASTRA_API_ENDPOINT
  );

  return chatDB;
}

export function timestampDBConnections() {
  const timestampDB = new AstraDB(
    process.env.RUSH_ASTRA_APP_TOKEN,
    process.env.RUSH_ASTRA_API_ENDPOINT
  );

  return timestampDB;
}

export function astra() {
  return new AstraDBVectorStore({
    params: {
      token: process.env.ASTRA_DB_APPLICATION_TOKEN,
      endpoint: process.env.ASTRA_DB_API_ENDPOINT,
    },
  });
}
