# Medium Clone

A full-stack blogging application inspired by Medium, built with a modern tech stack. This project features a robust backend, a responsive frontend, and a shared common library for type safety and validation.

##  Tech Stack

### Frontend
- **Framework:** React (v19)
- **Styling:** TailwindCSS (v4)
- **Build Tool:** Vite
- **Language:** TypeScript

### Backend
- **Runtime:** Node.js
- **Framework:** Express
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT, Bcrypt
- **Language:** TypeScript

### Common
- **Role:** Shared Zod schemas and type definitions used across both frontend and backend for consistent validation.
- **Package:** Published to npm as [`nikhlshrmadev-common-app`](https://www.npmjs.com/package/nikhlshrmadev-common-app).

## Project Structure 📂

```
├── backend                 # Backend Express application
│   ├── prisma              # Prisma schema and migrations
│   ├── src                 # Source code (routes, controllers, etc.)
│   ├── Dockerfile          # Backend Docker configuration
│   └── package.json
├── frontend                # Frontend React application
│   ├── src                 # Source code (components, pages, etc.)
│   ├── Dockerfile          # Frontend Docker configuration
│   └── package.json
├── common                  # Shared common module
│   ├── src                 # Zod schemas and types
│   └── package.json
└── docker-compose.yml      # Docker Compose configuration for the entire stack
```

## How to Run Locally

You can run the application either using Docker (recommended for ease) or manually by starting each service.

### Method 1: With Docker (Recommended)

Ensure you have Docker and Docker Compose installed.

1.  **Clone the repository**.
2.  **Run with Docker Compose**:
    ```bash
    docker compose up --build
    ```
    This will start the PostgreSQL database, Backend, and Frontend containers.
    - Frontend will be available at `http://localhost:5173`
    - Backend will be available at `http://localhost:3000`

### Method 2: Without Docker (Manual)

#### Prerequisites
- Node.js installed
- PostgreSQL running locally (or provide a connection string to a remote DB)

#### 1. Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment Variables:
    - Create a `.env` file in `backend/` and add your database URL and JWT Secret:
      ```
      DATABASE_URL=postgresql://username:password@localhost:5432/medium_db
      JWT_SECRET=your_jwt_secret
      ```
4.  Run Database Migrations:
    ```bash
    npx prisma migrate deploy
    ```
5.  Start the Backend:
    ```bash
    npm run start
    ```

#### 2. Frontend Setup
1.  Navigate to the frontend directory:
    ```bash
    cd ../frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment Variables:
    - Create a `.env` file in `frontend/` if needed (e.g., for API URL).
4.  Start the Frontend Development Server:
    ```bash
    npm run dev
    ```
