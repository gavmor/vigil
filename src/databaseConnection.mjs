import { AstraDB, Collection } from "@datastax/astra-db-ts";
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
