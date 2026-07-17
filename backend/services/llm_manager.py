from langchain_groq import ChatGroq
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage
import os
import logging
import asyncio

logger = logging.getLogger(__name__)


class FallbackLLMManager:
    """
    A robust LLM manager that automatically rotates between multiple free-tier
    AI providers when a quota limit (429) or any error is encountered.

    Fallback priority order:
      1. Google Gemini 1.5 Flash  (fast, generous free tier)
      2. Google Gemini 1.5 Pro    (powerful, free tier)
      3. Groq  – Llama 3.1 70B   (extremely fast inference)
      4. Groq  – Llama 3.1 8B    (lighter, separate rate limit)
      5. Groq  – Mixtral 8x7B    (strong reasoning)
      6. Groq  – Gemma 2 9B      (Google-trained open model on Groq)
      7. Groq  – Llama 3 70B     (legacy, separate quota)
    """

    def __init__(self):
        self.providers: list[dict] = []
        self._build_providers()

        if not self.providers:
            logger.warning(
                "No valid LLM API keys found. The system cannot generate responses. "
                "Set GEMINI_API_KEY and/or GROQ_API_KEY in your .env file."
            )
        else:
            names = [p["name"] for p in self.providers]
            logger.info(f"LLM Fallback chain ready with {len(names)} models: {names}")

    def _build_providers(self):
        """Build the ordered list of available LLM providers from env variables."""
        gemini_key = os.getenv("GEMINI_API_KEY", "").strip()
        groq_key = os.getenv("GROQ_API_KEY", "").strip()

        # ── 1 & 2: Google Gemini ──────────────────────────────────────────────
        if gemini_key and gemini_key not in ("your_gemini_key_here", ""):
            for model_name, label in [
                ("gemini-1.5-flash", "Gemini 1.5 Flash"),
                ("gemini-1.5-pro",   "Gemini 1.5 Pro"),
            ]:
                try:
                    llm = ChatGoogleGenerativeAI(
                        model=model_name,
                        google_api_key=gemini_key,
                        temperature=0.2,
                    )
                    self.providers.append({"name": label, "llm": llm})
                    logger.info(f"✓ {label} loaded.")
                except Exception as exc:
                    logger.warning(f"✗ {label} failed to load: {exc}")

        # ── 3–7: Groq (multiple models = multiple independent rate limits) ────
        # Each model has its own quota → 5 independent fallback slots
        if groq_key and groq_key not in ("your_groq_key_here", ""):
            groq_models = [
                ("llama3-8b-8192",            "Groq Llama3 8B"),          # most stable
                ("llama3-70b-8192",           "Groq Llama3 70B"),         # powerful
                ("llama-3.1-8b-instant",      "Groq Llama-3.1 8B"),      # fast
                ("mixtral-8x7b-32768",         "Groq Mixtral 8x7B"),      # reasoning
                ("gemma2-9b-it",               "Groq Gemma2 9B"),         # backup
            ]
            for model_id, label in groq_models:
                try:
                    llm = ChatGroq(
                        model_name=model_id,
                        groq_api_key=groq_key,
                        temperature=0.2,
                    )
                    self.providers.append({"name": label, "llm": llm})
                    logger.info(f"✓ {label} loaded.")
                except Exception as exc:
                    logger.warning(f"✗ {label} failed to load: {exc}")

    async def generate_response(self, prompt: str) -> str:
        """
        Try each provider in order. On any exception (rate-limit, timeout, etc.)
        immediately move on to the next provider without surfacing the error to
        the caller until every provider has been exhausted.
        """
        if not self.providers:
            raise RuntimeError(
                "No LLM providers are configured. Please add API keys to the .env file."
            )

        last_exception: Exception | None = None

        for provider in self.providers:
            name = provider["name"]
            llm  = provider["llm"]
            try:
                logger.info(f"Attempting response with {name}...")
                response = await llm.ainvoke([HumanMessage(content=prompt)])
                logger.info(f"✓ Response received from {name}.")
                return response.content
            except Exception as exc:
                logger.warning(
                    f"✗ {name} failed ({type(exc).__name__}: {exc}). "
                    "Switching to next provider..."
                )
                last_exception = exc
                # Small delay before trying next provider to avoid hammering APIs
                await asyncio.sleep(0.5)

        raise RuntimeError(
            f"All {len(self.providers)} LLM providers failed. "
            f"Last error: {last_exception}"
        )

    @property
    def available_models(self) -> list[str]:
        """Return names of all loaded models (useful for health-check endpoint)."""
        return [p["name"] for p in self.providers]


# Singleton – imported by main.py
llm_manager = FallbackLLMManager()
