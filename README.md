# Document Analyser

Upload a document (PDF, text or image) and ask questions about it in a simple chat UI.

## Tech stack
- Frontend: React (Vite)
- Backend: Node.js, Express, Multer
- AI: Google Gemini API
- Storage: in-memory (no database)

## How it works
1. The client uploads a file to `POST /api/upload`; the server keeps it in memory and returns a `documentId`.
2. The client sends `{ documentId, question }` to `POST /api/chat`.
3. The server sends the document and question to Gemini and returns the answer.

## Setup

### Server
cd server
npm install
cp .env.example .env   (then add your GEMINI_API_KEY)
npm run dev

### Client
cd client
npm install
npm run dev

The server runs on http://localhost:5000 and the client on http://localhost:5173.

## Notes
- Uploaded documents are lost when the server restarts.
- If Gemini returns a 503 (high demand), the app shows a friendly retry message.
