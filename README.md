# SkillBridge — Frontend

SkillBridge is a marketplace where students book one-on-one sessions with teachers. This is the React frontend — it talks to the [SkillBridge backend](https://github.com/saivenkat2609/SkillBridge-Backend) over REST and SignalR.

## What's in here

- Browse and search skills with filters (category, price range, sort)
- Book sessions with a calendar-based availability picker
- Student and teacher dashboards
- Real-time chat between students and teachers
- Google OAuth + email/password auth with email confirmation
- Fully responsive, built with MUI v7

## Tech

React 19, TypeScript, Vite, MUI v7, React Router v7, Axios, SignalR, Google OAuth

---

## Running locally

**Prerequisites:** Node.js 18+

```bash
git clone https://github.com/saivenkat2609/SkillBridge-UI.git
cd SkillBridge-UI
npm install
```

Create a `.env.local` file in the root:

```env
VITE_BFF_URL=http://localhost:5211
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

`VITE_BFF_URL` should point to wherever the backend is running. For local development that's `http://localhost:5211`. For production it points to the Azure backend.

```bash
npm run dev
```

App runs at `http://localhost:5173` by default.

## Google OAuth setup

To get `VITE_GOOGLE_CLIENT_ID`, go to [Google Cloud Console](https://console.cloud.google.com), create an OAuth 2.0 client, and add `http://localhost:5173` as an authorised JavaScript origin. The same client ID needs to be configured on the backend side too.

## Building for production

```bash
npm run build
```

Output goes to `dist/`. The app is deployed to Azure Static Web Apps via GitHub Actions on push to `main`.

## Environment variables (production)

Production env vars are set in the GitHub Actions workflow file (`.github/workflows/azure-static-web-apps-*.yml`) — not in any `.env` file. Don't commit secrets.
