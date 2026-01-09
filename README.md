# Health Risk Profiler

Lightweight service to extract health survey answers (text or image), score risk, and return recommendations using an LLM-backed extraction pipeline.

**Quick Start**



Install and run:

```bash
npm install
# develop with live-reload
npm run dev
# or run production
npm start
```

Environment
- Create a `.env` file at project root with:

```
GROQ_API_KEY=your_groq_api_key_here
PORT=3000 # optional
```

Project structure (key files)
- src/app.js — express app + route registration
- src/routes/surveyRoutes.js — POST /api/v1/health/analyze (text or image)
- src/services/aiService.js — AI extraction + recommendation orchestration
- src/services/scoringService.js — deterministic risk scoring logic
- src/schemas/healthSchema.js — Zod schema for extracted payload
- src/middleware/errorHandler.js — global error handler

API

Base URL (local): http://localhost:3000/api/v1/health

POST /analyze
- Content types: `multipart/form-data` (for image upload) or `application/json` (text-only)
- Fields:
  - `surveyForm` — file field (image of survey) when sending an image
  - `textData` — optional text string containing user answers when not uploading an image

Successful response (example):

```json
{
  "status": "ok",
  "risk_level": "moderate",
  "confidence": 0.92,
  "missing_fields": [],
  "score": 42,
  "factors": ["age: 55", "smoker: true"],
  "recommendations": ["Walk 30 minutes daily", "Reduce processed foods", "Quit smoking resources"]
}
```

Usage examples

# 1 — Text-only (application/json)
```bash
curl -X POST http://localhost:3000/api/v1/health/analyze \
  -H "Content-Type: application/json" \
  -d '{"textData":"I am 45, I smoke occasionally and exercise rarely."}'
```

# 2 — Image upload (multipart/form-data)
```bash
curl -X POST http://localhost:3000/api/v1/health/analyze \
  -F "surveyForm=@/path/to/survey.jpg" \
  -F "textData=Optional extra text"
```

Notes & Architecture details
- The service uses `groq-sdk` to call a chat/completions API for structured JSON extraction. The extracted JSON is validated with Zod (`src/schemas/healthSchema.js`).
- Guardrails: the route rejects empty requests and the AI pipeline will return an `incomplete_profile` status if >50% of expected fields are missing.
- Uploaded files are temporarily stored in `uploads/` and removed after processing. Keep the `uploads/` folder protected in production.

Troubleshooting
- Ensure `GROQ_API_KEY` is set and valid.
- If you see file permission or cleanup errors, check the `uploads/` folder permissions.


