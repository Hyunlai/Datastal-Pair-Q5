# Mythology Scholar Chat (Frontend + Backend)

Simple full-stack project with:
- `frontend/`: React + Redux + Vite
- `backend/`: Django + DRF + JWT auth + AI chat integration

## 0. Prerequisites

- Python 3.11+
- Node.js 18+
- npm
- Git

---

## 1. Clone The Project

```bash
git clone https://github.com/Hyunlai/Datastal-Pair-Q5.git
cd Datastal-Pair-Q5
```

If PowerShell blocks venv activation, run this once:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

---

## 2. Backend Setup (Django)

### Step 1: Go to backend folder

```bash
cd backend
```

### Step 2: Create and activate virtual environment

Windows PowerShell:

```powershell
python -m venv ..\venv
..\venv\Scripts\Activate.ps1
```

### Step 3: Install backend dependencies

```bash
pip install django djangorestframework djangorestframework-simplejwt python-dotenv openai django-cors-headers
```

### Step 4: Create `.env` in `backend/`

Create `backend/.env` and add your provider settings.

Example (Gemini):

```dotenv
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
AI_ALLOWED_TOPIC=mythology
```

Important:
- Never commit `.env`.
- If a key was exposed, rotate it immediately in your provider dashboard.

Example (OpenAI):

```dotenv
AI_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini
AI_ALLOWED_TOPIC=mythology
```

### Step 5: Run migrations

```bash
python manage.py migrate
```

### Step 6: Start backend server

```bash
python manage.py runserver
```

Backend runs at: `http://localhost:8000`

---

## 3. Frontend Setup (React + Vite)

Open a new terminal in project root:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

Note:
- `npm start` also works (mapped to Vite)

---

## 4. How Authentication Works

- Signup endpoint: `POST /api/v1/auth/signup/`
- Signin endpoint: `POST /api/v1/auth/signin/`
- Frontend stores JWT tokens in `localStorage`:
  - `accessToken`
  - `refreshToken`
- Axios interceptor automatically sends:
  - `Authorization: Bearer <accessToken>`

---

## 5. How AI Is Applied

Chat endpoint:
- `POST /api/v1/conversation/`

Flow:
1. User sends a message from frontend.
2. Backend saves user message to `Message` model.
3. Backend reads conversation history.
4. Backend applies a system prompt that restricts responses to `AI_ALLOWED_TOPIC` (default: mythology).
5. Backend calls provider based on `AI_PROVIDER`:
   - `gemini` -> Gemini REST API
   - `openai` -> OpenAI Chat Completions API
6. Backend saves assistant reply.
7. Backend returns JSON containing:
   - `conversation_id`
   - `latest_user_message`
   - `latest_assistant_message`
   - full `messages` history

Conversation endpoints used by frontend:
- `GET /api/v1/conversations/` (history list)
- `GET /api/v1/conversations/<id>/` (detail/history)

---

## 6. Quick Run Checklist

1. Backend terminal:
   - activate venv
   - `cd backend`
   - `python manage.py migrate`
   - `python manage.py runserver`
2. Frontend terminal:
   - `cd frontend`
   - `npm install`
   - `npm run dev`
3. Open `http://localhost:5173`
4. Register -> Login -> Start chat

---

## 7. Common Issues

- Register/login fails:
  - ensure backend is running on `:8000`
  - run `python manage.py migrate`
- Chat returns provider error:
  - check API key in `backend/.env`
  - confirm `AI_PROVIDER` matches the key type
- Browser blocked by CORS:
  - backend already allows `http://localhost:5173`
