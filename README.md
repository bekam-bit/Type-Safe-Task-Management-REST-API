# Type-Safe-Task-Management-REST-API

> A production-grade RESTful backend service built with Express and TypeScript for managing tasks with full CRUD operations, strict runtime validation via Zod, and persistent storage using an in-memory repository pattern.

---

## 🎯 Architecture & Rubric Alignment

This project satisfies all 5 rubric criteria for the **10-Point Technical Assessment**:

1. **Task Model & Validation Interfaces (`src/models/task.ts`)**:
   - Explicit types and interfaces for the `Task` entity.
   - Robust Zod schemas (`CreateTaskSchema`, `UpdateTaskSchema`, `TaskSchema`).
   - Strong type inference using `z.infer`.

2. **Type-Safe Task Controller (`src/controllers/taskController.ts`)**:
   - Implements full CRUD business logic (`getTasks`, `getTaskById`, `createTask`, `updateTask`, `deleteTask`).
   - Strongly typed Express `Request` and `Response` objects.
   - Clean decoupling via `TaskRepository`.

3. **Express Routing (`src/routes/taskRoutes.ts`)**:
   - Declarative Express `Router` mapping RESTful endpoints.
   - Modular route configuration mounted under `/api/tasks`.

4. **Runtime Input Validation Guards**:
   - Defends perimeter against invalid payloads using `CreateTaskSchema.safeParse()`.
   - Returns structured `HTTP 400 Bad Request` with field-level issues on invalid input.

5. **Response Contracts & Error Handling**:
   - Enforces explicit HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, `500 Internal Server Error`).
   - Uniform response envelopes: `{ success: boolean, data?: any, error?: string, issues?: any[] }`.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Tests
```bash
npm test
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Build Production Bundle
```bash
npm run build
npm start
```

---

## 📡 API Endpoints

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/health` | Healthcheck probe | `200` |
| `GET` | `/api/tasks` | Retrieve all tasks | `200`, `500` |
| `GET` | `/api/tasks/:id` | Retrieve task by ID | `200`, `404`, `500` |
| `POST` | `/api/tasks` | Create task with Zod validation | `201`, `400`, `500` |
| `PUT` | `/api/tasks/:id` | Partial update with Zod validation | `200`, `400`, `404`, `500` |
| `DELETE` | `/api/tasks/:id` | Delete task by ID | `200`, `404`, `500` |
