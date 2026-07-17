from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
import os
import tempfile
import logging

logger = logging.getLogger(__name__)

# Supported file types and their loader classes
SUPPORTED_EXTENSIONS = {
    ".pdf":  PyPDFLoader,
    ".docx": Docx2txtLoader,
    ".txt":  TextLoader,
}


class DocumentProcessor:
    """
    Handles loading, chunking, and preparing documents for vector storage.
    Supports PDF, DOCX (Word), and plain-text files.

    Chunking strategy:
      - chunk_size=1000 characters  → keeps each chunk within LLM token limits
      - chunk_overlap=200 characters → prevents sentences from being split across
        chunk boundaries, preserving semantic continuity
    """

    def __init__(self):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )

    async def process_file(self, file_bytes: bytes, filename: str):
        """
        Main entry point. Detects file type, loads content, and returns
        a list of LangChain Document chunks ready for embedding.
        """
        ext = os.path.splitext(filename)[1].lower()

        if ext not in SUPPORTED_EXTENSIONS:
            raise ValueError(
                f"Unsupported file type '{ext}'. "
                f"Supported types: {list(SUPPORTED_EXTENSIONS.keys())}"
            )

        loader_class = SUPPORTED_EXTENSIONS[ext]
        temp_file_path = None

        with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
            tmp.write(file_bytes)
            temp_file_path = tmp.name

        try:
            # TextLoader requires explicit encoding to avoid UnicodeDecodeError
            if ext == ".txt":
                loader = loader_class(temp_file_path, encoding="utf-8")
            else:
                loader = loader_class(temp_file_path)

            documents = loader.load()
            chunks = self.text_splitter.split_documents(documents)
            logger.info(
                f"Processed '{filename}': {len(documents)} page(s) → {len(chunks)} chunks."
            )
            return chunks

        except Exception as exc:
            logger.error(f"Error processing '{filename}': {exc}")
            raise

        finally:
            # Always clean up the temp file, even on error
            if temp_file_path and os.path.exists(temp_file_path):
                os.remove(temp_file_path)

    @staticmethod
    def is_supported(filename: str) -> bool:
        ext = os.path.splitext(filename)[1].lower()
        return ext in SUPPORTED_EXTENSIONS


# Singleton – imported by main.py
document_processor = DocumentProcessor()
