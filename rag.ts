import fs from "node:fs/promises";
import { Document, VectorStoreIndex, QdrantVectorStore, Ollama } from "llamaindex";


async function main() {
  const path = "node_modules/llamaindex/examples/abramov.txt";
  const essay = await fs.readFile(path, "utf-8");

  const vectorStore = new QdrantVectorStore({
    url: "http://localhost:6333",
  });

  const document = new Document({ text: essay, id_: path });

  const index = await VectorStoreIndex.fromDocuments([document], {
    vectorStore,
  });

  const queryEngine = index.asQueryEngine();

  const response = await queryEngine.query({
    query: "What did the author do in college?",
  });

  // Output response
  console.log(response.toString());
}

main().catch(console.error);
