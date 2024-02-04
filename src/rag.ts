import fs from "node:fs/promises";
import { Document, VectorStoreIndex, AstraDBVectorStore, Ollama, serviceContextFromDefaults, storageContextFromDefaults } from "llamaindex";

const path = "sample.txt";
const sample = await fs.readFile(path, "utf-8");
async function main() {
  // await init()
  // await ingest({body: sample})
  await query()
}

main().catch(console.error);

async function init() {
  await astra().create("RAGathon", {
    vector: { dimension: 1536, metric: "cosine" }
  });
}

export async function ingest(messages){
  const vectorStore = astra()

  await vectorStore.connect("RAGathon")
  const storageContext = await storageContextFromDefaults({ vectorStore });
  const documents = messages.map(text => new Document({ text }))

  await VectorStoreIndex.fromDocuments(documents, { storageContext });
}

async function query() {
  const vectorStore = astra();
  await vectorStore.connect("RAGathon")

  const index = await VectorStoreIndex.fromVectorStore(vectorStore, serviceContextFromDefaults())

  const results = await index.asRetriever().retrieve(
    `Smith`,
  );

  console.log(results);
}

function astra() {
  return new AstraDBVectorStore({
    params: {
      token: process.env.ASTRA_DB_APPLICATION_TOKEN,
      endpoint: process.env.ASTRA_DB_API_ENDPOINT
    },
  });
}
