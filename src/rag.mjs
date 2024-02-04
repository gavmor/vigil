import fs from "node:fs/promises";
import {
  Document,
  VectorStoreIndex,
  AstraDBVectorStore,
  Ollama,
  serviceContextFromDefaults,
  storageContextFromDefaults,
  SimilarityPostprocessor,
} from "llamaindex";

export async function init() {
  return await astra().create("ragathon", {
    vector: { dimension: 1536, metric: "cosine" },
  });
}

export async function ingest(messages) {
  const vectorStore = astra();

  await vectorStore.connect("ragathon");
  const storageContext = await storageContextFromDefaults({ vectorStore });
  const documents = messages.map((text) => new Document({ text }));

  await VectorStoreIndex.fromDocuments(documents, { storageContext });
}

export async function query(string) {
  const vectorStore = astra();
  await vectorStore.connect("ragathon");

  const index = await VectorStoreIndex.fromVectorStore(
    vectorStore,
    serviceContextFromDefaults()
  );
  const response = await index
    .asQueryEngine({
      nodePostprocessors: [
        new SimilarityPostprocessor({ similarityCutoff: 0.9 }),
      ],
    })
    .query({ query: string });
  // console.log(response.response);
  return response;
}

function astra() {
  return new AstraDBVectorStore({
    params: {
      token: process.env.ASTRA_DB_APPLICATION_TOKEN,
      endpoint: process.env.ASTRA_DB_API_ENDPOINT,
    },
  });
}
