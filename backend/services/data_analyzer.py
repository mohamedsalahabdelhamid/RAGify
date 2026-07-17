import pandas as pd
import tempfile
import os
import logging

logger = logging.getLogger(__name__)

# Chart color palette (indigo-purple gradient to match the frontend)
CHART_COLORS = [
    "rgba(99,102,241,0.8)",   # indigo
    "rgba(168,85,247,0.8)",   # purple
    "rgba(236,72,153,0.8)",   # pink
    "rgba(59,130,246,0.8)",   # blue
    "rgba(16,185,129,0.8)",   # emerald
    "rgba(245,158,11,0.8)",   # amber
    "rgba(239,68,68,0.8)",    # red
    "rgba(20,184,166,0.8)",   # teal
]


class DataAnalyzer:
    """
    Analyzes Excel and CSV files using Pandas and produces:
      • Summary statistics (row/column counts, dtypes)
      • Auto-detected bar chart data ready for Chart.js
      • Human-readable AI insight string
    """

    async def analyze_excel(self, file_bytes: bytes, filename: str) -> dict:
        ext = os.path.splitext(filename)[1].lower()
        temp_file_path = None

        with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
            tmp.write(file_bytes)
            temp_file_path = tmp.name

        try:
            # ── Read file using the correct engine ────────────────────────────
            if ext == ".csv":
                df = pd.read_csv(temp_file_path, encoding="utf-8", on_bad_lines="skip")
            elif ext == ".xls":
                df = pd.read_excel(temp_file_path, engine="xlrd")
            else:
                df = pd.read_excel(temp_file_path, engine="openpyxl")

            # Replace NaN with None for JSON serialisation
            df = df.where(pd.notnull(df), None)

            # ── Summary ───────────────────────────────────────────────────────
            numeric_cols = df.select_dtypes(include=["number"]).columns.tolist()
            cat_cols = df.select_dtypes(include=["object", "category"]).columns.tolist()

            summary = {
                "columns": list(df.columns),
                "rows_count": len(df),
                "numeric_columns": numeric_cols,
                "categorical_columns": cat_cols,
            }

            # ── Auto chart generation ─────────────────────────────────────────
            chart_data = None
            insights = "No obvious chart grouping found (file may be all-numeric or all-text)."

            if numeric_cols and cat_cols:
                cat_col = cat_cols[0]
                num_col = numeric_cols[0]

                grouped = (
                    df.groupby(cat_col)[num_col]
                    .sum()
                    .reset_index()
                    .sort_values(by=num_col, ascending=False)
                    .head(10)
                )

                labels = grouped[cat_col].astype(str).tolist()
                values = grouped[num_col].tolist()
                colors = (CHART_COLORS * ((len(labels) // len(CHART_COLORS)) + 1))[: len(labels)]

                chart_data = {
                    "type": "bar",
                    "labels": labels,
                    "datasets": [
                        {
                            "label": f"Sum of {num_col} by {cat_col}",
                            "data": values,
                            "backgroundColor": colors,
                            "borderColor": [c.replace("0.8", "1") for c in colors],
                            "borderWidth": 1,
                        }
                    ],
                }

                insights = (
                    f"Found {len(df)} rows across {len(df.columns)} columns. "
                    f"Top '{cat_col}' by '{num_col}': "
                    f"{grouped.iloc[0][cat_col]} ({grouped.iloc[0][num_col]:,.1f})."
                )

            elif numeric_cols:
                insights = (
                    f"Found {len(df)} rows with {len(numeric_cols)} numeric column(s). "
                    "No categorical column detected for grouping."
                )

            return {
                "summary": summary,
                "chart_data": chart_data,
                "insights": insights,
            }

        except Exception as exc:
            logger.error(f"DataAnalyzer error on '{filename}': {exc}")
            raise

        finally:
            if temp_file_path and os.path.exists(temp_file_path):
                os.remove(temp_file_path)


# Singleton – imported by main.py
data_analyzer = DataAnalyzer()
