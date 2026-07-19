# LearnKins — AI Content Factory

Full-stack MERN app that generates NCERT-aligned study material (notes, worksheets, flashcards, MCQs, mind maps, PPT outlines) using the Claude API.

## Stack

- **Frontend:** React (Vite) + Tailwind CSS + React Router
- **Backend:** Node.js + Express + MongoDB (Mongoose)
- **AI:** Groq API (free, OpenAI-compatible, no billing needed) — Llama 3.3 70B for content generation

No authentication — this is a single shared workspace, open for anyone using the app.

## Getting a free Groq API key

1. Go to [console.groq.com](https://console.groq.com), sign up with Google/GitHub (no credit card)
2. Left sidebar → **API Keys** → **Create API Key**
3. Copy the key (starts with `gsk_...`) into `backend/.env` as `GROQ_API_KEY`

Groq's free tier has generous rate limits and is plenty for a project like this.

## Project structure

```
learnkins-content-factory/
  backend/          Express API, MongoDB models, content generation, stats
  frontend/          React app — dashboard, content factory, history, stats
```

## Local setup

### 1. Backend

```
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI, GROQ_API_KEY
npm run dev
```

Runs on `http://localhost:5000`.

### 2. Frontend

```
cd frontend
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:5000/api
npm run dev
```

Runs on `http://localhost:5173`.

## Deployment

- **Backend → Render:** new Web Service, root directory `backend`, build command `npm install`, start command `npm start`. Add env vars from `.env.example` (MongoDB Atlas connection string for `MONGO_URI`, your Groq key for `GROQ_API_KEY`).
- **Frontend → Vercel:** import the repo, root directory `frontend`, framework preset Vite. Set `VITE_API_URL` to the deployed Render backend URL.
- Update `CLIENT_ORIGIN` in the backend env to the deployed Vercel URL so CORS allows it.

## API overview

| Method | Route                     | Description                  |
|--------|----------------------------|--------------------------------|
| POST   | /api/content/generate        | Generate content, saves it    |
| GET    | /api/content/history          | Full generation history        |
| DELETE | /api/content/history/:id      | Delete a history entry        |
| GET    | /api/admin/stats                | Content stats by type          |

## Notes for the internship writeup

- "Context" retrieval is currently a UI placeholder — real RAG needs an NCERT content corpus chunked and embedded into a vector store (pgvector / Pinecone), retrieved before the generation call in `backend/utils/groq.js`.
- Content generation prompts are centralized in `backend/utils/groq.js` — that's the file to extend with retrieval context once the corpus pipeline exists.
- No auth layer — every generated item is visible to everyone using the app. Adding per-user accounts later would mean reintroducing a `User` model and attaching a `user` reference back onto `Content`.
