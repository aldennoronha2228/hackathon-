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
- 🔌 **Wokwi Integration** — Lint, run, scenario test, and serial capture directly from the UI
- 🧪 **Proof Lab** — Live demonstration panel to run real Wokwi commands (ideal for hackathon judging)
- 🔗 **MCP Console** — Interactive Model Context Protocol sessions for fine-grained simulator control
- 🔐 **Authentication** — JWT-based auth with bcrypt password hashing
- 🌗 **Dark/Light Theme** — Persistent theme toggle across all pages
- 📊 **Project Management** — Full CRUD operations for projects with per-user isolation
- 🎯 **Evidence-Based AI** — Simulation results are fed back into AI prompts for context-aware guidance

---

## 🏗️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework |
| **Vite 8** | Build tool & dev server |
| **Tailwind CSS 4** | Utility-first styling |
| **Framer Motion** | Animations & page transitions |
| **Zustand** | Lightweight state management |
| **React Router 7** | Client-side routing |
| **Axios** | HTTP client |
| **React Hot Toast** | Notification system |

### Backend
| Technology | Purpose |
|------------|---------|
| **Express 5** | REST API server |
| **Firebase Admin + Firestore** | Cloud database |
| **Groq SDK** | LLM inference (AI services) |
| **JSON Web Token** | Authentication |
| **bcryptjs** | Password hashing |
| **MCP SDK** | Model Context Protocol client for Wokwi |
| **Nodemon** | Dev auto-reload |

---

## 📁 Project Structure

```
HardCodeV1/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HeroPage.jsx          # Landing page with 3D tilt cards
│   │   │   ├── AuthPage.jsx          # Login / Signup
│   │   │   ├── HomePage.jsx          # Project dashboard (CRUD)
│   │   │   └── DesignPage.jsx        # Design phase + Wokwi chat
│   │   ├── components/
│   │   │   ├── ProjectMainPage.jsx   # Ideation + Components chat tabs
│   │   │   ├── ProjectChat.jsx       # Ideation chat interface
│   │   │   ├── ComponentsChat.jsx    # Components chat interface
│   │   │   ├── DesignChat.jsx        # Design chat interface
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
│   │   │   ├── user.model.js             # User schema
│   │   │   └── project.model.js          # Project schema (all phases)
│   │   ├── routes/                       # Express route definitions
│   │   ├── middleware/
│   │   │   └── auth.middleware.js        # JWT verification
│   │   ├── lib/
│   │   │   ├── db.js                     # MongoDB connection
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
- **Firebase Project** (with Firestore enabled)
- **Wokwi CLI** (for simulation features)
- **Groq API Key** (for AI features)

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
```

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

### AI Chat Phases
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/ideation/:id` | Send message in Ideation phase |
| `POST` | `/api/components/:id` | Send message in Components phase |
| `POST` | `/api/design/:id` | Send message in Design phase |

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

## 🧪 Wokwi Proof Lab

The **Proof Lab** is a dedicated panel for live hardware simulation demonstrations:

- **Lint** — Validate the Wokwi diagram for wiring errors
- **Run** — Execute the simulation and check serial output
- **Scenario** — Run predefined test scenarios (YAML-based)
- **Serial Capture** — Record serial monitor output over a time window
- **MCP Console** — Step-by-step interactive simulation control (start, read serial, set pins, take screenshots, export VCD)

All evidence (pass/fail, serial output, timing) is persisted to the project and fed back into AI prompts for context-aware guidance.

---

## 👥 Team

Built for hackathon demonstration — showcasing the full loop from **idea → design → proof** using AI and real simulation evidence.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
