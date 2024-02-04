import { AstraDB, Collection } from "@datastax/astra-db-ts";
import dotenv from "dotenv";
dotenv.config();

console.log(process.env);

export function chatDBConnections() {
  return new AstraDB({
    baseUrl: process.env.RUSH_ASTRA_API_ENDPOINT,
    applicationToken: process.env.RUSH_ASTRA_APP_TOKEN,
  });
}

export function timestampDBConnections() {
  return new AstraDB({
    baseUrl: process.env.RUSH_ASTRA_API_ENDPOINT,
    applicationToken: process.env.RUSH_ASTRA_APP_TOKEN,
  });
}
