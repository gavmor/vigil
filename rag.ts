import { Document, VectorStoreIndex, QdrantVectorStore, Ollama, serviceContextFromDefaults } from "llamaindex";

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