# Architecture Reference (مرجع الذكاء الاصطناعي)

هذا الملف مخصص لأي نموذج ذكاء اصطناعي (AI Model) يقوم بالعمل على هذا المشروع مستقبلاً ليفهم الهيكلية والقرارات التقنية.

## Tech Stack
- **Frontend:** Next.js (App Router), Tailwind CSS.
- **Backend:** Python (FastAPI).
- **Vector Database:** Pinecone.
- **LLMs (Fallback Strategy):** Gemini (Primary) -> Groq -> Cohere -> Together AI -> HuggingFace.

## System Workflow
1. **File Upload:** The user uploads a file (PDF, Excel, etc.) via the Next.js frontend.
2. **Processing:** FastAPI receives the file. 
   - If PDF/Text: Processed via LangChain, chunked, embedded, and stored in Pinecone.
   - If Excel/CSV: Processed via Pandas to extract insights/charts.
3. **Chat/RAG:** User asks a question -> FastAPI creates an embedding -> Retrieves context from Pinecone -> Sends to the active LLM (via Fallback Manager) -> Returns the answer.
4. **Dashboards:** Standalone Next.js page that fetches visual data from the backend to render charts.

## Deployment Topology
- **Vercel:** Hosts the Next.js frontend.
- **Render:** Hosts the FastAPI backend (Free web service).
- **Pinecone:** Serverless vector database.
