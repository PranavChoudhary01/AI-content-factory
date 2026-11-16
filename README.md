# LearnKins — AI Content Factory

Full-stack MERN app that generates NCERT-aligned study material (notes, worksheets, flashcards, MCQs, mind maps, PPT outlines) using the Groq API, with PDF export support.

## Stack

- **Frontend:** React (Vite) + Tailwind CSS + React Router
- **Backend:** Node.js + Express + MongoDB (Mongoose)
- **Auth:** JWT + bcrypt password hashing — signup/login save user data to MongoDB. This is **login for account creation only**, not access control: every page (dashboard, content factory, history, stats) is open whether or not you're logged in.
- **AI:** Groq API (free, OpenAI-compatible) — model `openai/gpt-oss-20b` for content generation
- **Export:** Client-side PDF export using `jsPDF` — no backend changes needed

## Project structure

```
learnkins-content-factory/
  backend/          Express API — auth (signup/login), content generation, history, stats
  frontend/          React app — login/signup, dashboard, content factory, history, stats, PDF export
```

## Local setup

### 1. Backend

```
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, GROQ_API_KEY
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



## API overview

| Method | Route                     | Description                  |
|--------|----------------------------|--------------------------------|
| POST   | /api/auth/signup             | Create account (saved to MongoDB) |
| POST   | /api/auth/login               | Log in, returns JWT           |
| GET    | /api/auth/me                   | Current user profile (requires token) |
| POST   | /api/content/generate        | Generate content, saves it    |
| GET    | /api/content/history          | Full generation history (scoped by device ID) |
| DELETE | /api/content/history/:id      | Delete a history entry        |
| GET    | /api/admin/stats                | Content stats by type          |

## How content history stays private without login

Every browser generates a random device ID on first visit (`frontend/src/api/deviceId.js`), stored in `localStorage` and sent as the `X-Device-Id` header on every request. The backend (`backend/controllers/contentController.js`) scopes all content queries by this ID, so each device sees only its own history — no login required.

## PDF Export

Every generated content item (in both the Content Factory and History pages) has an "Export as PDF" button. This uses `jsPDF` entirely client-side — no backend involvement — and formats the PDF differently per content type (numbered questions for worksheets, Q/A pairs for flashcards, highlighted correct answers for MCQs, etc). See `frontend/src/utils/exportPdf.js`.
