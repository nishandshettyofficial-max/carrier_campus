# Project Agent Guidelines & Team Playbook (`AGENTS.md`)

Welcome to the team workspace! This file establishes instructions, domain responsibilities, and engineering guidelines for AI coding assistants working in this repository.

---

## 1. Project Overview & Context

> **Status:** Ideation Phase (Concept details to be finalized)

- **Project Name:** `[Your Project Name / Working Title]`
- **One-Liner / Pitch:** `[Brief 1-sentence summary of what the project does]`
- **Target Audience:** `[Who is this built for? (e.g., students, clinicians, developers, retail)]`
- **Primary Goal for the Workshop:** Build a functional, polished MVP prototype for live demonstration by `[Demo Deadline/Time]`.

---

## 2. Team Composition & Domain Roles

Our team brings together diverse domain backgrounds. The AI assistant must adapt its explanations and output according to domain context.

| Team Member | Domain / Background | Primary Responsibility in Project |
| :--- | :--- | :--- |
| **You (Lead)** | `[Your Domain, e.g., Fullstack / ML / Domain Expert]` | `[e.g., Architecture, System Design, Integration]` |
| **Teammate 1** | `[Domain X, e.g., UI/UX & Frontend]` | `[e.g., UI Design, User Flow, Client-side Views]` |
| **Teammate 2** | `[Domain Y, e.g., Backend / Data / Cloud]` | `[e.g., APIs, Database, Services, Pipeline]` |
| **Teammate 3** | `[Domain Z, e.g., Business / Subject Matter / Research]` | `[e.g., Domain Logic, User Research, Pitch Deck]` |

### Cross-Disciplinary Interaction Principles
- **Clarity over Jargon:** When explaining technical decisions, bridge domain terminology so all teammates understand architectural trade-offs.
- **Modular Boundaries:** Keep frontend, backend, and domain logic cleanly separated so team members can work in parallel without blocking each other or causing git conflicts.

---

## 3. Tech Stack & Environment (To Be Finalized)

Configure the chosen stack below once agreed upon by the team:

- **Frontend:** `[e.g., Next.js / Vite React / Vanilla HTML+JS / Flutter / Streamlit]`
- **Backend / APIs:** `[e.g., Node.js (Fastify/Express) / Python (FastAPI/Flask)]`
- **Database / Storage:** `[e.g., SQLite / PostgreSQL / Firebase / Supabase / BigQuery]`
- **AI / Models:** `[e.g., Gemini API (Interactions/Live/Flash), HuggingFace, Local LLM]`
- **Deployment / Hosting:** `[e.g., Firebase App Hosting, Vercel, Cloud Run, Local Dev Server]`

---

## 4. Agent Guidelines & Coding Standards

When assisting this project, the AI agent **must adhere to the following rules**:

### A. Workshop MVP Priorities
1. **Working Over Perfect:** Prioritize a working end-to-end prototype over premature optimization.
2. **Visual & User Delight:** Hackathon/workshop judging heavily rewards intuitive UX and aesthetics. Use modern typography, cohesive color schemes, micro-interactions, and dark/light modes where applicable.
3. **No Placeholders in Demos:** Avoid leaving non-functional `TODO` placeholders or dead buttons in user flows demonstrated during evaluation.

### B. Code Quality & Modularity
- **Environment Secrets:** Never hardcode API keys, credentials, or tokens. Always use `.env.local` or `.env` and provide a clean `.env.example`.
- **Modularity:** Group code into logical units (`/components`, `/services`, `/api`, `/utils`, `/data`).
- **Error Handling:** Gracefully handle failed API calls or missing inputs with user-friendly error banners or fallback UI states.
- **Documentation Integrity:** Preserve comments and document public API routes or core data models.

---

## 5. Workshop Milestone Roadmap

- [ ] **Phase 1: Team Alignment & Idea Finalization**
  - Define core problem, 1 primary persona, and key value metric.
  - Finalize tech stack & role assignments.
- [ ] **Phase 2: Project Setup & "Walking Skeleton"**
  - Initialize project scaffolding, git repository, and base environment.
  - Create a functional end-to-end hello-world connection between frontend and backend/API.
- [ ] **Phase 3: Core Feature MVP**
  - Implement 1–2 killer features that deliver on the core problem statement.
- [ ] **Phase 4: Polish & Demo Prep**
  - UI styling polish, responsive layout checks, and edge-case smoothing.
  - Prepare test data, seeded database records, or demo scenarios.
- [ ] **Phase 5: Presentation & Pitch**
  - Rehearse live demonstration flow and backup recording/screenshots.

---

## 6. Key Commands & Run Instructions

```bash
# Setup dependencies
# [e.g., npm install / pip install -r requirements.txt]

# Start development server
# [e.g., npm run dev / uvicorn main:app --reload]

# Run tests / lint
# [e.g., npm test / pytest]
```
