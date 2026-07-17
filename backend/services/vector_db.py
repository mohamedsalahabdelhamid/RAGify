from pinecone import Pinecone, ServerlessSpec
from langchain_community.embeddings import HuggingFaceEmbeddings
from uuid import uuid4
import os
import logging

logger = logging.getLogger(__name__)

class VectorDBManager:
    def __init__(self):
        self.pc = None
        self.index = None
        # Using a free HuggingFace model for embeddings (no API key needed, runs locally in the backend)
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

        pinecone_key = os.getenv("PINECONE_API_KEY")
        if pinecone_key and pinecone_key != "your_pinecone_key_here":
            try:
                self.pc = Pinecone(api_key=pinecone_key)
                index_name = os.getenv("PINECONE_INDEX_NAME", "rag-index")

                if index_name not in [i.name for i in self.pc.list_indexes()]:
                    logger.info(f"Creating Pinecone index: {index_name}")
                    self.pc.create_index(
                        name=index_name,
                        dimension=384,  # matches all-MiniLM-L6-v2 output dimension
                        metric="cosine",
                        spec=ServerlessSpec(
                            cloud="aws",
                            region="us-east-1"
                        )
                    )
                self.index = self.pc.Index(index_name)
                logger.info("Pinecone VectorDB initialized successfully.")
            except Exception as e:
                logger.error(f"Failed to initialize Pinecone: {e}")

    def add_chunks(self, chunks, filename: str = "unknown", namespace: str = "default"):
        if not self.index:
            logger.warning("Vector DB not initialized. Check PINECONE_API_KEY.")
            return

        vectors = []
        for i, chunk in enumerate(chunks):
            embedding = self.embeddings.embed_query(chunk.page_content)
            # FIX #2: Use a unique ID per chunk combining filename + uuid to prevent
            # overwriting chunks from previously uploaded files on subsequent uploads.
            unique_id = f"{filename}_{uuid4().hex}_{i}"
            vectors.append({
                "id": unique_id,
                "values": embedding,
                "metadata": {"text": chunk.page_content, "source": filename, **chunk.metadata}
            })

        # Upsert in batches of 100 to respect Pinecone API limits
        batch_size = 100
        for batch_start in range(0, len(vectors), batch_size):
            batch = vectors[batch_start: batch_start + batch_size]
            self.index.upsert(vectors=batch, namespace=namespace)
        logger.info(f"Added {len(vectors)} chunks from '{filename}' to Pinecone.")

    def query(self, query_text: str, top_k: int = 5, namespace: str = "default"):
        if not self.index:
            logger.warning("Vector DB not initialized. Check PINECONE_API_KEY.")
            return None

        query_embedding = self.embeddings.embed_query(query_text)
        results = self.index.query(
            vector=query_embedding,
            top_k=top_k,
            include_metadata=True,
            namespace=namespace
        )
        return results

vector_db = VectorDBManager()
