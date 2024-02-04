import fs from "node:fs/promises";
import { Document, VectorStoreIndex, AstraDBVectorStore, Ollama, serviceContextFromDefaults, storageContextFromDefaults } from "llamaindex";

const path = "node_modules/llamaindex/examples/abramov.txt";
const essay = await fs.readFile(path, "utf-8");
async function main() {
  // await init()
  // await ingest({body: essay})
  await query()
}

main().catch(console.error);

async function init() {
  await astra().create("RAGathon", {
    vector: { dimension: 1536, metric: "cosine" }
  });
}

export async function ingest(event){
  const vectorStore = astra()

  await vectorStore.connect("RAGathon")
  const storageContext = await storageContextFromDefaults({ vectorStore });
  const document = new Document({ text: event.body});

  await VectorStoreIndex.fromDocuments([document], { storageContext });
}

async function query() {
  const vectorStore = astra();
  await vectorStore.connect("RAGathon")

  const index = await VectorStoreIndex.fromVectorStore(vectorStore, serviceContextFromDefaults())

  const [{score: a}, {score: b}] = await index.asRetriever().retrieve(
    `Tell me a joke. Do not apologize.`,
  );

  console.log(a, b);
}

function astra() {
  return new AstraDBVectorStore({
    params: {
      token: process.env.ASTRA_DB_APPLICATION_TOKEN,
      endpoint: process.env.ASTRA_DB_API_ENDPOINT
    },
  });
}
