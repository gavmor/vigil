import fs from "node:fs/promises";
import { Document, VectorStoreIndex, QdrantVectorStore, Ollama, serviceContextFromDefaults } from "llamaindex";

const path = "node_modules/llamaindex/examples/abramov.txt";
const essay = await fs.readFile(path, "utf-8");
export async function ingest(event){
  const vectorStore = new QdrantVectorStore({
    url: "http://localhost:6333",
  });

  const document = new Document({ text: event.body});

  await VectorStoreIndex.fromDocuments([document], {
    vectorStore,
  });

}

async function query() {
  const qdrant = new QdrantVectorStore({
    url: "http://localhost:6333",
  });
  const index = await VectorStoreIndex.fromVectorStore(qdrant, serviceContextFromDefaults())
  const queryEngine = index.asQueryEngine();

  const response = await queryEngine.query({
    query: "What did the author do in college?",
  });

  // Output response
  console.log(response.toString());
}

async function main() {
  await ingest({body: essay})
  await query()
}

main().catch(console.error);
