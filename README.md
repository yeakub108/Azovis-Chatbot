# 🤖 Azovis AI Chatbot

Professional OpenAI Chatbot with Next.js Frontend and Express Backend

## 📁 Project Structure

```
azovis-chatbot/
├── frontend/              # Next.js Frontend (runs on port 3000)
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── .env.local
│   ├── package.json
│   └── node_modules/
│
└── backend/              # Express Backend (runs on port 5000)
    ├── config/
    ├── controllers/
    ├── index.js
    ├── middleware/
    ├── routes/
    ├── services/
    ├── utils/
    ├── .env
    ├── .env.example
    ├── package.json
    └── node_modules/
```

## 🚀 Quick Start

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Configure Environment Variables

**Backend:**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000
MODEL=gpt-4o-mini
```

**Frontend:**
`frontend/.env.local` is already configured:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Run Development Servers

**Backend (Terminal 1):**
```bash
cd backend
npm run dev
```
Server runs on: `http://localhost:5000`

**Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```
App runs on: `http://localhost:3000`

### 4. Access the Application

Open browser: `http://localhost:3000`

## 📝 Available Scripts

### Backend (from backend/)
```bash
npm start          # Start backend server
npm run dev        # Start with auto-reload
```

### Frontend (from frontend/)
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

## 🛠️ Tech Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Lucide React

### Backend
- Express.js
- OpenAI SDK
- Node.js

## 📡 API Endpoints

Backend runs on port **5000**:

- `GET /health` - Health check
- `POST /api/chat` - Send message
- `POST /api/chat/reset` - Reset conversation
- `GET /api/chat/stats/:sessionId?` - Get stats

## 🔧 Configuration

**Backend (.env):**
- `OPENAI_API_KEY` (Required)
- `PORT` (Default: 5000)
- `MODEL` (Default: gpt-4o-mini)

**Frontend (.env.local):**
- `NEXT_PUBLIC_API_URL` (Default: http://localhost:5000)

## 📖 Usage

1. Start backend on port 5000
2. Start frontend on port 3000
3. Open `http://localhost:3000`
4. Start chatting!

---

**Built with ❤️ using Next.js, Express, and OpenAI**
