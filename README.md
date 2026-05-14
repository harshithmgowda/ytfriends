# WatchParty

A modern full-stack YouTube watch party app with private rooms, real-time chat, encrypted messages, and a WhatsApp-style dark UI.

## Tech stack

- **Frontend:** React, Vite, Tailwind CSS, Axios, React Router DOM, Socket.IO Client, React YouTube, Framer Motion
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Socket.IO, CryptoJS, Multer, dotenv

## Project structure

- `client/` – Vite React frontend
- `server/` – Express + MongoDB backend

## Local setup

### 1) Backend

```bash
cd server
npm install
copy .env.example .env
npm run dev
```

### 2) Frontend

```bash
cd client
npm install
copy .env.example .env
npm run dev
```

## Environment variables

### `server/.env`

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=supersecretjwt
ENCRYPTION_KEY=myencryptionkey
CLIENT_URL=http://localhost:5173
```

### `client/.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Key features

- JWT authentication
- Protected routes
- Private room creation and joining by key
- YouTube sync with Socket.IO
- Real-time encrypted chat
- Image/message support
- Social feed posts
- Responsive dark UI

## Deployment

### Backend on Render

This repo includes `render.yaml` for the backend service.

Render environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_strong_random_secret
ENCRYPTION_KEY=your_strong_random_secret
CLIENT_URL=https://your-vercel-app.vercel.app
NODE_ENV=production
```

### Frontend on Vercel

Deploy the `client` folder as a Vercel project.

Set these Vercel environment variables:

```env
VITE_API_URL=https://your-render-app.onrender.com/api
VITE_SOCKET_URL=https://your-render-app.onrender.com
```

The frontend includes `client/vercel.json` so React Router routes work on refresh.

### GitHub

The workspace is ready to be initialized as a Git repository and pushed to:

```text
https://github.com/harshithmgowda/ytfriends.git
```

After committing locally, use:

```bash
git remote add origin https://github.com/harshithmgowda/ytfriends.git
git branch -M main
git push -u origin main
```

## Notes

- The backend serves uploaded images from `/uploads`.
- For production, set `CLIENT_URL` to your deployed frontend origin and update the client env values accordingly.

