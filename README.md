# Quizora

**A High-Performance, Modern Online Assessment & Quiz Management Platform.**

Quizora is a comprehensive, production-ready assessment engine designed to create, manage, and execute secure quizzes and tests. Built with a modern technology stack, it provides administrators with powerful quiz-building tools and delivers a seamless, distraction-free testing experience for students with real-time analytics.

---

## 📸 Product Preview

*(Placeholders for future screenshots)*

*   **Landing & Authentication:** Modern, animated login and registration flows.
*   **Admin Dashboard:** Overview of platform statistics and user metrics.
*   **Quiz Builder:** Intuitive interface for creating categories, quizzes, and multiple-choice questions.
*   **Student Experience:** Distraction-free assessment environment with a secure, server-validated timer.
*   **Results & Analytics:** Detailed performance breakdown using interactive charts.

---

## 🚀 Key Features

### Authentication & Security
*   **Role-Based Access Control (RBAC):** Strict separation between Admin and Student interfaces.
*   **Secure Authentication:** JWT-based stateless authentication with bcrypt password hashing.
*   **Protected Routes:** Frontend and backend route protection to prevent unauthorized access.

### Admin Management
*   **User Management:** Oversee registered users and their platform status.
*   **Category Management:** Organize quizzes logically into distinct categories.
*   **Quiz Management:** Create, publish, unpublish, and configure quizzes (duration, passing score, difficulty, and max attempts).
*   **Question Builder:** Dynamic interface for adding, editing, and deleting questions and multiple-choice options.

### Assessment Engine
*   **Server-Side Validation:** All scores, percentages, and validations are calculated securely on the backend to prevent manipulation.
*   **Join Codes:** Unique, auto-generated codes for private/direct quiz access.
*   **Strict Time Management:** Backend-enforced timers that track attempt duration precisely.
*   **Stateful Attempts:** Support for tracking "In Progress," "Passed," and "Failed" states.

### Student Experience & Analytics
*   **Interactive Dashboard:** View available quizzes, past attempts, and overall performance.
*   **Active Quiz Environment:** Distraction-free interface with clear navigation and live countdown timer.
*   **Instant Results:** Immediate feedback on submission, detailing correct, incorrect, and unanswered questions.
*   **Performance Tracking:** Visual analytics and score history utilizing Recharts.

---

## 👥 User Roles

| Role | Capabilities |
| :--- | :--- |
| **Admin** | Full access to create/edit categories, manage quizzes, author questions, and oversee users. Cannot participate in quizzes as a student. |
| **Student** | Can browse published quizzes, join via codes, attempt assessments, and view their personal results and analytics history. |

---

## 🔄 Application Workflow

**Administrator Journey:**
`Login` → `Dashboard` → `Manage Categories` → `Create Quiz` → `Use Quiz Builder (Add Questions/Options)` → `Publish Quiz` → `Monitor Users`.

**Student Journey:**
`Register/Login` → `Student Dashboard` → `Browse / Enter Join Code` → `View Quiz Details` → `Start Assessment` → `Submit Answers` → `View Comprehensive Results`.

---

## 🛠️ Technology Stack

Quizora utilizes a decoupled architecture, leveraging modern frameworks for high performance and maintainability.

### Frontend
*   **Framework:** React 19 (via Vite)
*   **Routing:** React Router DOM v7
*   **Styling:** Tailwind CSS v4
*   **Animations:** Framer Motion
*   **Data Visualization:** Recharts
*   **State Management & Forms:** React Hook Form
*   **HTTP Client:** Axios

### Backend
*   **Framework:** FastAPI (Python)
*   **ORM:** SQLAlchemy 2.0
*   **Database Migrations:** Alembic

### Database
*   **Primary Database:** PostgreSQL (`psycopg2-binary`)

### Authentication & Security
*   **Tokens:** PyJWT (JSON Web Tokens)
*   **Hashing:** bcrypt / passlib
*   **Validation:** Pydantic

---

## 🏛️ Architecture

Quizora follows a standard Client-Server architecture with a RESTful API bridging the React frontend and FastAPI backend.

```mermaid
graph TD
    Client[React Frontend] -->|REST API calls| API[FastAPI Application]
    API -->|Validation| Pydantic[Pydantic Schemas]
    API -->|Auth| Security[JWT / Dependency Injection]
    API -->|Query| ORM[SQLAlchemy ORM]
    ORM -->|Transactions| DB[(PostgreSQL Database)]
```

### Major Layers (Backend)
1.  **API Routing (`app/api/v1`):** Defines the REST endpoints and handles HTTP requests/responses.
2.  **Dependencies (`deps.py`):** Injects database sessions and current authenticated users (RBAC checks).
3.  **CRUD Operations (`app/crud`):** Encapsulates all database interactions.
4.  **Schemas (`app/schemas`):** Pydantic models for request validation and response serialization.
5.  **Models (`app/models`):** SQLAlchemy declarative base classes representing database tables.

---

## 📁 Project Structure

```text
Quizora/
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI elements
│   │   ├── pages/            # View components (Admin & Student)
│   │   ├── context/          # React Context (Auth)
│   │   ├── services/         # Axios API clients
│   │   └── App.jsx           # Main application routing
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── api/v1/endpoints/ # API Route handlers
│   │   ├── core/             # Security and config settings
│   │   ├── crud/             # Database queries
│   │   ├── models/           # SQLAlchemy DB models
│   │   ├── schemas/          # Pydantic validation schemas
│   │   └── main.py           # FastAPI entry point
│   ├── alembic/              # Database migration scripts
│   └── requirements.txt
│
└── README.md
```

---

## 🗄️ Database Design

The database is highly relational, ensuring data integrity across quizzes and user attempts.

**Core Entities:**
*   **Users:** Stores credentials and RBAC roles.
*   **Categories:** Logical groupings for quizzes.
*   **Quizzes:** The core assessment entity, linked to a Category.
*   **Questions:** Linked to a specific Quiz.
*   **Options:** Multiple choices linked to a specific Question (tracks `is_correct`).
*   **Attempts:** Records a user's execution of a quiz, storing calculated scores, time taken, and status.
*   **Answers:** Records the specific option a user selected for a question during an attempt.

---

## 🔌 API Documentation

The backend exposes a comprehensive, versioned REST API (`/api/v1`).

*(Note: Full interactive API documentation is available at `http://localhost:8000/docs` when running the backend).*

### Authentication
| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Public | Register a new user |
| `POST` | `/api/v1/auth/login` | Public | Authenticate and retrieve JWT access token |

### Quizzes & Categories
| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/categories/` | Public | List all categories |
| `POST` | `/api/v1/categories/` | Admin | Create a new category |
| `GET` | `/api/v1/quizzes/` | Public | List all quizzes |
| `POST` | `/api/v1/quizzes/` | Admin | Create a new quiz |
| `GET` | `/api/v1/quizzes/{id}` | Public | Get quiz details |
| `GET` | `/api/v1/quizzes/join/{code}` | Student | Access a quiz via join code |
| `POST` | `/api/v1/quizzes/{id}/questions` | Admin | Add a question (with options) to a quiz |

### Assessment Engine
| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/attempts/start` | Student | Initialize a new quiz attempt |
| `POST` | `/api/v1/attempts/{id}/submit`| Student | Submit answers, calculate score, and finalize attempt |
| `GET` | `/api/v1/attempts/` | Student | Retrieve user's past attempts |
| `GET` | `/api/v1/attempts/{id}` | Student | Retrieve detailed breakdown of a specific attempt |

---

## ⚙️ Installation & Setup

### Prerequisites
*   Python 3.9+
*   Node.js 18+
*   PostgreSQL database instance

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Quizora
```

### 2. Backend Setup
```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
touch .env
```

**Backend `.env` Configuration:**
```ini
# backend/.env
DATABASE_URL=postgresql://user:password@localhost:5432/quizora
SECRET_KEY=your_super_secret_jwt_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**Run Database Migrations:**
```bash
alembic upgrade head
```

### 3. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Create environment file
touch .env
```

**Frontend `.env` Configuration:**
```ini
# frontend/.env
VITE_API_URL=http://localhost:8000/api/v1
```

---

## 🚀 Running the Application

For local development, you need to run both the backend server and the frontend development server concurrently in separate terminal windows.

**Start the Backend (Terminal 1):**
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn app.main:app --reload
```
*Backend runs on: `http://localhost:8000`*
*Interactive API Docs (Swagger): `http://localhost:8000/docs`*

**Start the Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```
*Frontend runs on: `http://localhost:5173`*

---

## 🛡️ Security Measures Implemented

*   **Password Cryptography:** Secure bcrypt hashing (never storing plain text passwords).
*   **Stateless Sessions:** JWT-based authentication preventing session hijacking.
*   **Backend Validation:** Trusting no client. All score aggregations and correct/incorrect validations are executed server-side.
*   **Dependency Injection (RBAC):** FastAPI dependencies explicitly verify the `role` property embedded in the JWT payload before executing Admin routes.
*   **CORS Protection:** Configured to restrict origin access securely.

---

## 📜 License

*Licensing information has not yet been specified for this project.*
