from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
import os
import logging

logger = logging.getLogger(__name__)

class VectorDBManager:
    def __init__(self):
        self.db_path = os.path.join(os.path.dirname(__file__), "..", "vectorstore", "db_faiss")
        # Using a free HuggingFace model for embeddings (no API key needed, runs locally in the backend)
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        logger.info("Local FAISS VectorDB manager initialized.")

    def add_chunks(self, chunks, filename: str = "unknown", namespace: str = "default"):
        if not chunks:
            return

        logger.info(f"Adding {len(chunks)} chunks from '{filename}' to local FAISS DB...")
        
        # Ensure the directory exists
        os.makedirs(self.db_path, exist_ok=True)
        
        # Create a temporary FAISS index from the new chunks
        new_db = FAISS.from_documents(chunks, self.embeddings)
        
        # Check if the DB already exists locally
        if os.path.exists(os.path.join(self.db_path, "index.faiss")):
            logger.info("Existing FAISS DB found. Merging...")
            existing_db = FAISS.load_local(self.db_path, self.embeddings, allow_dangerous_deserialization=True)
            existing_db.merge_from(new_db)
            existing_db.save_local(self.db_path)
        else:
            logger.info("No existing FAISS DB found. Creating a new one...")
            new_db.save_local(self.db_path)
            
        logger.info(f"Successfully saved {len(chunks)} chunks to FAISS.")

    def query(self, query_text: str, top_k: int = 5, namespace: str = "default"):
        if not os.path.exists(os.path.join(self.db_path, "index.faiss")):
            logger.warning("Local FAISS DB not found. No documents have been indexed yet.")
            return None

        try:
            db = FAISS.load_local(self.db_path, self.embeddings, allow_dangerous_deserialization=True)
            docs = db.similarity_search(query_text, k=top_k)
            
            # Format the results to match the expected format in main.py
            # main.py expects: results["matches"] -> list of dicts with "metadata" dict containing "text"
            matches = []
            for doc in docs:
                matches.append({
                    "metadata": {
                        "text": doc.page_content,
                        **doc.metadata
                    }
                })
            return {"matches": matches}
        except Exception as e:
            logger.error(f"Error querying FAISS DB: {e}")
            return None

vector_db = VectorDBManager()
