# Task Manager Challenge

A full-stack task management web application built as part of the Turboly technical assessment. This application focuses on delivering a robust backend API integrated with a highly optimized, fully adaptive frontend experience tailored for desktop, tablet, and mobile layouts.

---

## Tech Stack

### Frontend
- Core: Vue 3 (Composition API) & TypeScript
- Build Tool: Vite
- Styling: Tailwind CSS
- Date Utility: Day.js
- Icons: Lucide Vue

### Backend
- Core: Node.js & Express
- Database ORM: Sequelize (PostgreSQL dialect)
- Authentication: JSON Web Tokens (JWT) & BcryptJS

---

## Key Features

1. **Secure Session Authentication**
   - Secure login and registration.
   - Route guards on the frontend to prevent unauthorized access.
   - Axios request interceptor automatically attaches the JWT Bearer token to all API calls.

2. **Adaptive Form UI/UX**
   - Instead of standard fluid resizing, the task creation form alters its structural container dynamically to fit screen dimensions perfectly:
     - **Desktop**: A centered Modal dialog with smooth glassmorphism.
     - **Tablet**: A right-side landscape Slide-Over Drawer.
     - **Mobile**: A comprehensive Bottom Sheet taking up 92% of the vertical viewport.

3. **Interactive Sorting**
   - Clickable table headers on desktop and tablet with reactive sorting indicators (ASC/DESC chevron animations) for Due Date, Title, and Priority.
   - Custom segmented sort controls on mobile view for easy, touch-friendly sorting.

4. **"Due Today" Scanning & Focus Mode**
   - Automatically scans and computes active tasks due on the current day.
   - Displays a warm alert banner at the top of the dashboard.
   - Features a "Perform Now" toggle which instantly isolates and displays only tasks due today, allowing users to focus on immediate requirements.

5. **Robust Partial Updates**
   - Fully optimized PATCH requests that support isolated property updates (such as toggling completion or changing priority levels) without triggering unwanted validation errors.

---

## Folder Structure

```text
task-manager-challenge/
├── client/     # Vue 3 Frontend
└── server/     # Express & Sequelize Backend
```

---

## Setup and Installation

### Prerequisites
- Node.js (v20+ recommended)
- PostgreSQL database instance running locally

---

### Backend Setup (`/server`)

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables. Create a `.env` file in the `/server` directory using the provided `.env.example` as a template:
   ```env
   NODE_ENV="development"
   PORT=3000
   DATABASE_URL="postgresql://<username>:<password>@localhost:5432/<database_name>"
   JWT_SECRET_KEY="your-super-secure-jwt-key"
   ```

4. Run migrations and database seeds:
   ```bash
   npm run db:create    # If database doesn't exist yet
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:3000`.

---

### Frontend Setup (`/client`)

1. Navigate to the client directory:
   ```bash
   cd ../client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables. Create a `.env` file in the `/client` directory:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api/v1
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

---

## Notable Architectural Solutions

- **Express Middleware Parameter Binding Fix**: During development, we identified that registering parameter-dependent authorization middlewares globally via `router.use(authorization)` executes before Express parses route parameters. This resulted in empty `req.params`. We refactored this to bind the middleware in-line directly to the specific `/task/:id` routes, resolving parameter parsing and securing endpoints.
- **Dynamic Field Updating**: To support isolated updates (such as toggling completion state or updating priority options), the controller dynamically filters incoming keys in `req.body`. This prevents Sequelize from evaluating missing parameters as `undefined` or `null`, thereby avoiding validation blocks.
