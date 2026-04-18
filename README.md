<p align="center">
  <img src="https://img.shields.io/badge/HARDCODE-v1.0-6366f1?style=for-the-badge&labelColor=0a0c10" alt="HardCode Badge"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white&labelColor=0a0c10" alt="React"/>
  <img src="https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white&labelColor=0a0c10" alt="Express"/>
  <img src="https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=white&labelColor=0a0c10" alt="Firebase"/>
  <img src="https://img.shields.io/badge/Wokwi-Integrated-22C55E?style=for-the-badge&labelColor=0a0c10" alt="Wokwi"/>
  <img src="https://img.shields.io/badge/Groq_AI-Powered-F97316?style=for-the-badge&labelColor=0a0c10" alt="Groq AI"/>
</p>

<h1 align="center">⚡ HardCode</h1>
<p align="center"><strong>AI-Powered Hardware Project Design & Simulation Platform</strong></p>
<p align="center">
  From vague idea → structured design → real circuit simulation — all in one workspace.
</p>

---

## 🧠 What is HardCode?

**HardCode** is a full-stack web application that guides users through the complete lifecycle of a hardware project — from brainstorming an idea to designing circuit architectures and running live simulations via **Wokwi**. It uses **Groq AI (LLM)** at every stage to act as an intelligent hardware engineering co-pilot.

### The 3-Phase Workflow

| Phase | Description |
|-------|-------------|
| **💡 Ideation** | Conversational AI refines a vague hardware idea into a concrete, buildable specification with clear requirements and resolved unknowns. |
| **🔩 Components** | AI generates a system architecture, component list, wiring connections, and expected output behavior. |
| **🎨 Design & Simulation** | AI provides step-by-step Wokwi circuit layout guidance, with live simulation evidence (lint, run, scenario, serial capture) fed back for continuous improvement. |

---

## ✨ Key Features

- 🤖 **AI-Driven Conversations** — Groq-powered chat in each project phase (Ideation → Components → Design)
- 💬 **Smart Suggestion Chips** — Clickable starter prompts appear at the beginning of each chat phase so users can kick off conversations instantly
- 🔌 **Wokwi Integration** — Lint, run, scenario test, and serial capture directly from the UI
- 🧪 **Proof Lab** — Live demonstration panel to run real Wokwi commands (ideal for hackathon judging)
- 🔗 **MCP Console** — Interactive Model Context Protocol sessions for fine-grained simulator control
- 🔐 **Authentication** — JWT-based auth with bcrypt password hashing stored in Firebase
- 🌗 **Dark/Light Theme** — Persistent theme toggle across all pages
- 📊 **Project Management** — Full CRUD operations for projects with per-user isolation
- 🎯 **Evidence-Based AI** — Simulation results are fed back into AI prompts for context-aware guidance

---

## 🏗️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19 | UI framework |
| **Vite** | 8 | Build tool & dev server |
| **Tailwind CSS** | 4 | Utility-first styling |
| **Framer Motion** | 12 | Animations & transitions |
| **Zustand** | 5 | Lightweight state management |
| **React Router** | 7 | Client-side routing |
| **Axios** | 1.x | HTTP client |
| **React Hot Toast** | 2.x | Notification system |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Express** | 5 | REST API server |
| **Firebase Admin + Firestore** | 13 | Cloud database |
| **Groq SDK** | 1.x | LLM inference (AI services) |
| **JSON Web Token** | 9.x | Authentication tokens |
| **bcryptjs** | 3.x | Password hashing |
| **MCP SDK** | 1.x | Model Context Protocol client for Wokwi |
| **cookie-parser** | 1.x | JWT cookie handling |
| **Nodemon** | 3.x | Dev auto-reload |

---

## 📁 Project Structure

```
HardCode/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HeroPage.jsx          # Landing page with 3D tilt cards
│   │   │   ├── AuthPage.jsx          # Login / Signup
│   │   │   ├── HomePage.jsx          # Project dashboard (CRUD)
│   │   │   └── DesignPage.jsx        # Design phase + Wokwi chat
│   │   ├── components/
│   │   │   ├── ProjectMainPage.jsx   # Ideation + Components chat tabs
│   │   │   ├── ProjectChat.jsx       # Ideation chat + suggestion chips
│   │   │   ├── ComponentsChat.jsx    # Components chat + suggestion chips
│   │   │   ├── DesignChat.jsx        # Design chat + suggestion chips
│   │   │   └── WokwiProofLab.jsx     # Live Wokwi simulation panel
│   │   ├── store/
│   │   │   ├── useAuthStore.js       # Auth state (Zustand)
│   │   │   └── useThemeStore.js      # Theme state (Zustand)
│   │   ├── lib/                      # Utility helpers
│   │   ├── App.jsx                   # Route definitions
│   │   └── main.jsx                  # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js        # Signup / Login / Logout
│   │   │   ├── project.controller.js     # Project CRUD
│   │   │   ├── ideation.controller.js    # Ideation chat endpoint
│   │   │   ├── components.controller.js  # Components chat endpoint
│   │   │   ├── design.controller.js      # Design chat endpoint
│   │   │   └── wokwi.controller.js       # Wokwi lint/run/scenario/serial/MCP
│   │   ├── services/
│   │   │   ├── ai.services.js            # Groq AI prompt engineering
│   │   │   ├── wokwi-runner.service.js   # Wokwi CLI execution
│   │   │   └── wokwi-mcp-client.service.js # MCP session management
│   │   ├── models/
│   │   │   ├── user.model.js             # Firestore user model
│   │   │   └── project.model.js          # Firestore project model (all phases)
│   │   ├── routes/                       # Express route definitions
│   │   ├── middleware/
│   │   │   └── auth.middleware.js        # JWT verification
│   │   ├── lib/
│   │   │   ├── db.js                     # Firebase Admin + Firestore init
│   │   │   ├── utils.js                  # Token generation helpers
│   │   │   ├── wokwi.js                  # Wokwi CLI readiness check
│   │   │   └── wokwi-context.js          # Live circuit context parser
│   │   └── index.js                      # Server entry point
│   ├── wokwi-smoke/                      # Sample Wokwi project for testing
│   │   ├── diagram.json
│   │   ├── sketch.ino
│   │   ├── smoke.test.yaml
│   │   └── wokwi.toml
│   └── package.json
│
└── .github/workflows/                    # CI/CD configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **Firebase Project** with Firestore enabled ([create one here](https://console.firebase.google.com))
- **Groq API Key** ([get one here](https://console.groq.com))
- **Wokwi CLI Token** (optional — required only for simulation features)

### 1. Clone the Repository

```bash
git clone https://github.com/aldennoronha2228/hackathon-.git
cd hackathon-
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"your-project-id",...}
JWT_SECRET=your_jwt_secret_here
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
WOKWI_CLI_TOKEN=your_wokwi_token_here   # optional
```

> **Note:** The `FIREBASE_SERVICE_ACCOUNT_JSON` value is the full contents of your Firebase service account JSON file, minified into a single line. The backend automatically handles `\n` newline conversion in the private key.

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at **http://localhost:5173**

---

## 🔑 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/signup` | Create a new account |
| `POST` | `/api/auth/login` | Log in and receive JWT cookie |
| `POST` | `/api/auth/logout` | Clear auth cookie |
| `GET` | `/api/auth/check` | Verify current auth status |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/projects` | List all user projects |
| `GET` | `/api/project/:id` | Get project details |
| `POST` | `/api/project` | Create a new project |
| `PUT` | `/api/project/:id` | Update project |
| `DELETE` | `/api/project/:id` | Delete project |
| `GET` | `/api/project/:id/history/:phase` | Get chat history for a phase |

### AI Chat Phases
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/project/chat` | Send message in Ideation phase |
| `POST` | `/api/components/init` | Initialize Components AI for a project |
| `POST` | `/api/components/chat` | Send message in Components phase |
| `POST` | `/api/design/chat` | Send message in Design phase |

### Wokwi Simulation
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/wokwi/lint` | Lint a Wokwi diagram |
| `POST` | `/api/wokwi/run` | Run simulation |
| `POST` | `/api/wokwi/scenario` | Run scenario test |
| `POST` | `/api/wokwi/serial/capture` | Capture serial output |
| `GET` | `/api/wokwi/evidence/:id` | Get simulation evidence |
| `POST` | `/api/wokwi/mcp/session/start` | Start MCP session |
| `POST` | `/api/wokwi/mcp/session/:id/tool` | Call MCP tool |
| `POST` | `/api/wokwi/mcp/session/:id/stop` | Stop MCP session |
| `GET` | `/api/wokwi/mcp/sessions` | List active MCP sessions |

---

## 🖥️ Application Screens

| Screen | Route | Description |
|--------|-------|-------------|
| **Hero / Landing** | `/` | 3D tilt card landing page with feature showcase |
| **Auth** | `/auth` | Login & signup with form validation |
| **Home / Dashboard** | `/home` | Project list with create, rename, delete |
| **Project Workspace** | `/project/:id` | Ideation + Components chat tabs |
| **Design Workspace** | `/project/:id/design` | Design chat + Wokwi Proof Lab |

---

## 💬 Chat Suggestion Chips

Each AI chat phase starts with **clickable suggestion prompts** to help users kick off conversations quickly:

- **Ideation** — Pre-built project ideas (smart home, weather station, plant watering, etc.)
- **Components** — Quick prompts for sensor selection, microcontroller choice, power options
- **Design** — Prompts for layout suggestions, color schemes, UX flow, and screen planning

Chips animate in with a staggered entrance and disappear once the first message is sent.

---

## 🧪 Wokwi Proof Lab

The **Proof Lab** is a dedicated panel for live hardware simulation demonstrations:

- **Lint** — Validate the Wokwi diagram for wiring errors
- **Run** — Execute the simulation and check serial output
- **Scenario** — Run predefined test scenarios (YAML-based)
- **Serial Capture** — Record serial monitor output over a time window
- **MCP Console** — Step-by-step interactive simulation control (start, read serial, set pins, take screenshots, export VCD)

All evidence (pass/fail, serial output, timing) is persisted to the project and fed back into AI prompts for context-aware guidance.

---

## 🗄️ Database

HardCode uses **Firebase Firestore** as its database. No Firestore indexes are required — all multi-field queries are handled with in-memory sorting/filtering for zero-configuration setup.

### Collections
| Collection | Description |
|------------|-------------|
| `users` | User accounts (email, hashed password, profile) |
| `projects` | Projects with all phase data (ideation, components, design, wokwi evidence) |

---

## ⚙️ Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | ✅ | Backend server port (default: `5000`) |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | ✅ | Firebase service account JSON (single-line) |
| `JWT_SECRET` | ✅ | Secret key for signing JWT tokens |
| `GROQ_API_KEY` | ✅ | API key for Groq AI inference |
| `GROQ_MODEL` | ✅ | Groq model name (e.g. `llama-3.3-70b-versatile`) |
| `WOKWI_CLI_TOKEN` | ⬜ | Wokwi CLI token (simulation features only) |

---

## 👥 Team

Built for hackathon demonstration — showcasing the full loop from **idea → design → proof** using AI and real simulation evidence.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
