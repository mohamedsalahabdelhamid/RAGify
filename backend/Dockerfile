# 1. استخدام نسخة بايثون خفيفة ومستقرة
FROM python:3.11-slim

# 2. منع بايثون من إنشاء ملفات مؤقتة وتسريع الطباعة في الـ Logs
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 3. تثبيت حزم النظام المطلوبة للمكتبات الثقيلة
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 4. إعداد مستخدم عادي بصلاحيات محدودة (شرط أساسي في Hugging Face)
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

# 5. تحديد مجلد العمل داخل حساب المستخدم
WORKDIR $HOME/app

# 6. نسخ ملف المكتبات وتثبيتها
COPY --chown=user requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# 7. نسخ باقي ملفات المشروع
COPY --chown=user . .

# 8. البورت الافتراضي لـ Hugging Face
EXPOSE 7860

# 9. تشغيل FastAPI على بورت 7860 تلقائياً
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]