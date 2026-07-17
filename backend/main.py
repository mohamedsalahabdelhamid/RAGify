from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import logging

load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger(__name__)

from services.document_processor import document_processor
from services.vector_db import vector_db
from services.llm_manager import llm_manager
from services.data_analyzer import data_analyzer

app = FastAPI(
    title="Professional RAG System API",
    description="An AI-powered document analysis and retrieval system.",
    version="1.0.0",
)

# CORS: Allow the Vercel frontend URL in production, all origins locally
frontend_url = os.getenv("FRONTEND_URL", "*")
origins = [frontend_url] if frontend_url != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Excel file extensions ───────────────────────────────────────────────────
EXCEL_EXTENSIONS = {".xlsx", ".xls", ".csv"}


@app.get("/")
def health_check():
    """Health check endpoint — also returns which LLM models are loaded."""
    return {
        "status": "healthy",
        "message": "Professional RAG System is running.",
        "loaded_models": llm_manager.available_models,
    }


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Accepts any supported file. Routes to the correct processor based on extension:
      • PDF / DOCX / TXT  → chunked, embedded, stored in Pinecone
      • XLSX / XLS / CSV  → analyzed with Pandas → returns chart-ready JSON
    """
    filename = file.filename or "unknown"
    ext = os.path.splitext(filename)[1].lower()
    contents = await file.read()

    # ── Document files (RAG pipeline) ────────────────────────────────────────
    if document_processor.is_supported(filename):
        try:
            chunks = await document_processor.process_file(contents, filename)
        except ValueError as exc:
            raise HTTPException(status_code=415, detail=str(exc))
        except Exception as exc:
            raise HTTPException(status_code=500, detail=f"Processing error: {exc}")

        vector_db.add_chunks(chunks, filename=filename)

        prompt = (
            f"I just uploaded a document named '{filename}' with {len(chunks)} text chunks. "
            "Acknowledge it in one professional sentence and confirm you are ready for questions."
        )
        try:
            summary = await llm_manager.generate_response(prompt)
        except Exception:
            summary = (
                f"✅ '{filename}' has been indexed ({len(chunks)} chunks). "
                "Ask me anything about it!"
            )

        return {
            "filename": filename,
            "status": "processed",
            "type": "document",
            "chunks": len(chunks),
            "message": summary,
        }

    # ── Excel / CSV files (analytics pipeline) ───────────────────────────────
    if ext in EXCEL_EXTENSIONS:
        try:
            analysis = await data_analyzer.analyze_excel(contents, filename)
        except Exception as exc:
            raise HTTPException(status_code=500, detail=f"Analysis error: {exc}")

        return {
            "filename": filename,
            "status": "analyzed",
            "type": "excel",
            "analysis": analysis,
            "message": "✅ Excel data analyzed and insights extracted successfully.",
        }

    # ── Unsupported ───────────────────────────────────────────────────────────
    raise HTTPException(
        status_code=415,
        detail=(
            f"Unsupported file type '{ext}'. "
            "Supported: PDF, DOCX, TXT, XLSX, XLS, CSV."
        ),
    )


@app.post("/chat")
async def chat(message: str = Form(...)):
    """
    RAG chat endpoint.
    1. Embeds the question and retrieves the top-5 most relevant chunks from Pinecone.
    2. Sends context + question to the active LLM (auto-fallback if quota exceeded).
    3. Returns the generated answer.
    """
    if not message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    # ── Retrieve context from Vector DB ──────────────────────────────────────
    context = ""
    try:
        results = vector_db.query(message, top_k=5)
        if results and results.get("matches"):
            context_texts = [
                m["metadata"]["text"]
                for m in results["matches"]
                if m.get("metadata", {}).get("text")
            ]
            context = "\n\n---\n\n".join(context_texts)
    except Exception as exc:
        logger.warning(f"Vector DB query failed (answering without context): {exc}")

    # ── Build prompt ──────────────────────────────────────────────────────────
    if context:
        prompt = (
            "You are a professional AI assistant with access to uploaded documents.\n"
            "Answer the question using ONLY the context provided below.\n"
            "If the answer is not in the context, say: 'I could not find this information in the uploaded documents.'\n\n"
            f"CONTEXT:\n{context}\n\n"
            f"QUESTION: {message}\n\n"
            "ANSWER:"
        )
    else:
        prompt = (
            "You are a professional AI assistant.\n"
            "No documents have been indexed yet. Answer using your general knowledge.\n"
            "Remind the user they can upload PDF, DOCX, or Excel files for document-specific answers.\n\n"
            f"QUESTION: {message}\n\n"
            "ANSWER:"
        )

    # ── Generate response (auto-fallback across all providers) ────────────────
    try:
        response_text = await llm_manager.generate_response(prompt)
        return {"response": response_text, "context_found": bool(context)}
    except RuntimeError as exc:
        return {
            "response": (
                "⚠️ All AI providers are currently unavailable (quota exceeded). "
                "Please try again in a few minutes."
            ),
            "context_found": False,
            "error": str(exc),
        }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
