                                     # JobTracker AI — Frontend

A React.js frontend for JobTracker AI — a full-stack job application tracking platform with AI-powered job description analysis and career assistance.

## Tech Stack

- React.js 18
- React Router DOM — client-side navigation
- Axios — API calls with JWT interceptor
- Recharts — data visualization
- React Hot Toast — notifications
- Lucide React — icons
- Deployed on Vercel

## Features

- JWT authentication — login, register, auto-redirect
- Protected routes — unauthenticated users redirected to login
- Dashboard — application stats cards + kanban-style status filters
- Application management — add, edit, delete, update status
- AI JD Analyzer — paste any job description, get match score + skill gaps
- AI Career Chatbot — ask anything about interview prep or job search
- Profile page — manage your skill profile used for AI matching

## Pages

| Route | Description |
|-------|-------------|
| /login | Login page |
| /register | Registration with skills input |
| /dashboard | Main dashboard with applications |
| /analyze | AI JD Analyzer + Career Chatbot |
| /profile | Skill and profile management |

## Local Setup

### Prerequisites
- Node.js 18+
- Backend running at `http://localhost:8080`

### Steps

1. Clone the repository:
```bash
git clone https://github.com/bhadra06/jobtracker-frontend.git
cd jobtracker-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

App runs at `http://localhost:3000`

> Make sure the backend is running at port 8080 before starting the frontend.

## Project Structure

```
src/
├── api/
│   └── axios.js          # Axios instance with JWT interceptor
├── context/
│   └── AuthContext.js    # Global auth state management
├── components/
│   ├── Navbar.jsx         # Top navigation bar
│   ├── StatsCards.jsx     # Dashboard stat cards
│   ├── ApplicationCard.jsx # Job application card
│   └── AddApplicationModal.jsx # Add/edit modal
├── pages/
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── DashboardPage.jsx
│   ├── AnalyzePage.jsx
│   └── ProfilePage.jsx
└── utils/
    └── constants.js       # Status colors and labels
```

## How the AI Analyzer Works

1. User updates their skill profile on the Profile page
2. User pastes a job description on the Analyze page
3. Frontend sends the JD to the Spring Boot backend
4. Backend fetches user skills from PostgreSQL
5. Backend sends JD + skills to Groq (Llama 3.3 AI)
6. AI returns: match score, matched skills, missing skills, suggestions
7. Frontend renders the results as a visual score card

## Important — Groq API Key (Backend)

The AI features depend on a Groq API key configured in the backend.

> ⚠️ The current Groq API key expires on **May 28, 2026**. After this date, a new key must be generated at [console.groq.com](https://console.groq.com) and updated in the backend environment variables. The frontend itself requires no API key changes.

## Backend Repository

[github.com/bhadra06/jobtracker-api](https://github.com/bhadra06/jobtracker-api)

## Screenshots

### Dashboard
Shows all job applications with status filters and stats cards.

### AI Analyzer
Paste any job description and get an instant AI-powered match score.

### Profile
Manage your skills to improve AI match accuracy.

## Author

**Chowtipalli Veera Bhadram**  
B.Tech Computer Science (Data Science) — KL University, May 2026  
AWS Cloud Practitioner | Red Hat Certified Enterprise App Developer

- GitHub: [github.com/bhadra06](https://github.com/bhadra06)
- LinkedIn: [linkedin.com/in/chowtipalli-veera-bhadram](https://linkedin.com/in/chowtipalli-veera-bhadram)
- Email: bhadrachowtipalli3@gmail.com