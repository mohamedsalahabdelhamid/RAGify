from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
import os
import logging

logger = logging.getLogger(__name__)


class VectorDBManager:
    """
    Manages a local FAISS vector database with:
      - In-memory caching (loads from disk once, stays in RAM)
      - Proper cache invalidation when new chunks are added or deleted
      - Delete-by-filename support for clean document removal
    """

    def __init__(self):
        self.db_path = os.path.join(os.path.dirname(__file__), "..", "vectorstore", "db_faiss")
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        self._cached_db: FAISS | None = None  # In-memory cache
        logger.info("Local FAISS VectorDB manager initialized.")

    def _load_db(self) -> FAISS | None:
        """Load FAISS from disk into cache (only if not already cached)."""
        if self._cached_db is not None:
            return self._cached_db
        index_path = os.path.join(self.db_path, "index.faiss")
        if not os.path.exists(index_path):
            return None
        try:
            self._cached_db = FAISS.load_local(
                self.db_path, self.embeddings, allow_dangerous_deserialization=True
            )
            logger.info("FAISS DB loaded from disk into memory cache.")
            return self._cached_db
        except Exception as e:
            logger.error(f"Failed to load FAISS DB: {e}")
            return None

    def _invalidate_cache(self):
        """Force reload from disk on next access."""
        self._cached_db = None

    def add_chunks(self, chunks, filename: str = "unknown"):
        if not chunks:
            return

        logger.info(f"Adding {len(chunks)} chunks from '{filename}' to FAISS DB...")
        os.makedirs(self.db_path, exist_ok=True)

        new_db = FAISS.from_documents(chunks, self.embeddings)

        existing_db = self._load_db()
        if existing_db is not None:
            logger.info("Merging into existing FAISS DB...")
            existing_db.merge_from(new_db)
            existing_db.save_local(self.db_path)
            self._cached_db = existing_db  # Update cache directly
        else:
            logger.info("Creating new FAISS DB...")
            new_db.save_local(self.db_path)
            self._cached_db = new_db  # Populate cache

        logger.info(f"Successfully saved {len(chunks)} chunks to FAISS.")

    def query(self, query_text: str, top_k: int = 5):
        db = self._load_db()
        if db is None:
            logger.warning("FAISS DB not found. No documents have been indexed yet.")
            return None

        try:
            docs = db.similarity_search(query_text, k=top_k)
            matches = [
                {"metadata": {"text": doc.page_content, **doc.metadata}}
                for doc in docs
            ]
            return {"matches": matches}
        except Exception as e:
            logger.error(f"Error querying FAISS DB: {e}")
            return None

    def delete_by_filename(self, filename: str) -> bool:
        """
        Remove all vectors belonging to a specific file from FAISS.
        Rebuilds the index without the target file's chunks.
        Returns True if deletion was performed, False if DB was empty or file not found.
        """
        db = self._load_db()
        if db is None:
            return False

        try:
            # Get all documents currently stored in the FAISS index
            all_ids = list(db.index_to_docstore_id.values())
            ids_to_delete = []

            for doc_id in all_ids:
                doc = db.docstore.search(doc_id)
                if doc and doc.metadata.get("source") == filename:
                    ids_to_delete.append(doc_id)

            if not ids_to_delete:
                logger.info(f"No FAISS vectors found for '{filename}'.")
                return False

            db.delete(ids_to_delete)
            db.save_local(self.db_path)
            self._cached_db = db  # Update cache
            logger.info(f"Deleted {len(ids_to_delete)} vectors for '{filename}' from FAISS.")
            return True

        except Exception as e:
            logger.error(f"Error deleting '{filename}' from FAISS: {e}")
            # Invalidate cache to force a clean reload next time
            self._invalidate_cache()
            return False

    def reset(self):
        """Wipe the entire FAISS database."""
        self._invalidate_cache()


# Singleton – imported by main.py
vector_db = VectorDBManager()
