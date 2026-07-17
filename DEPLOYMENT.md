# دليل نشر المشروع أونلاين 🚀

هذا الدليل يشرح لك كيف تنشر مشروعك باحترافية على خوادم مجانية لتعرضه كمنتج نهائي.

## 🏗️ الهيكلية
- **الواجهة الأمامية (Frontend):** سيتم رفعها على `Vercel` (مجاني وأسرع للـ Next.js).
- **الواجهة الخلفية (Backend):** سيتم رفعها على `Render` (سيرفر حقيقي مجاني لتشغيل البايثون والذكاء الاصطناعي).

---

## 🔒 كيف تتم حماية مفاتيح الـ API الخاصة بك؟ (مهم جداً)
لا تقلق أبداً، مفاتيحك (Gemini, Groq, Pinecone) **مستحيل أن يراها أي شخص يستخدم موقعك**، وذلك لسببين هندسيين في مشروعنا:
1. **في الكود (GitHub):** ملف `.gitignore` يمنع رفع ملف `.env` إلى GitHub. الكود سيكون مكشوفاً، لكن مفاتيحك لا.
2. **للمستخدمين (الموقع):** الواجهة الأمامية لا تملك المفاتيح أصلاً! المستخدم يرسل سؤاله إلى الباك إند (Render)، والباك إند هو الذي يتصل بـ Groq/Gemini من داخله ويرجع الإجابة. المفاتيح مشفرة ومخبأة داخل سيرفر Render ولا تخرج منه أبداً.

---

## الخطوة 1: الرفع على GitHub
1. أنشئ مستودع (Repository) في GitHub.
2. ارفع مجلد المشروع كاملاً إليه (ستلاحظ أن ملف `.env` لن يُرفع تلقائياً، وهذا ممتاز).

---

## الخطوة 2: نشر الـ API (الباك إند) على Render
1. ادخل إلى [Render.com](https://render.com) وسجل بحساب GitHub.
2. اضغط **New** ثم **Web Service** واربط مستودعك.
3. **الإعدادات:**
   - **Root Directory:** `backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. **وضع المفاتيح بسرية (Environment Variables):**
   انزل لأسفل لـ `Advanced` -> `Add Environment Variable` وأضفها يدوياً هنا:
   - `GEMINI_API_KEY` = مفتاحك
   - `GROQ_API_KEY` = مفتاحك
   - `PINECONE_API_KEY` = مفتاحك
   - `PINECONE_INDEX_NAME` = `rag-index`
   - `FRONTEND_URL` = `*` (مبدئياً).
5. اضغط **Create Web Service**. انسخ الرابط الذي سيظهر لك (مثال: `https://nexus-ai.onrender.com`).

---

## الخطوة 3: نشر الواجهة الأمامية (الفرونت إند) على Vercel
1. ادخل إلى [Vercel.com](https://vercel.com) وسجل دخولك.
2. اضغط **Add New...** ثم **Project** واختر مستودعك.
3. **الإعدادات:**
   - **Root Directory:** `frontend`
   - **Environment Variables:** أضف متغيراً جديداً:
     - **Name:** `NEXT_PUBLIC_API_URL`
     - **Value:** رابط الـ Render الذي نسخته في الخطوة السابقة.
4. اضغط **Deploy**. 

🎉 **مبارك! موقعك الآن يعمل كمنتج نهائي احترافي، ومفاتيحك مشفرة ومحمية 100%.**
