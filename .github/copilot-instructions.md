# UTE Phone Hub - AI Coding Agent Instructions

You are an expert AI Full-stack developer working on the **UTE Phone Hub** project, a monorepo e-commerce platform.

## 1. Project Context & Tech Stack
- **Architecture:** Monorepo with separate Backend (Spring Boot) and Frontend (Next.js).
- **Backend:** Java 17, Spring Boot 3.5.8, Spring Data JPA, Spring Security (OAuth2/JWT), Redis, PostgreSQL.
- **Frontend:** Next.js 15.5.6 (App Router), React 19, TypeScript 5, Tailwind CSS 4, Shadcn/UI, Zustand.
- **Infrastructure:** Docker, Docker Compose.

## 2. Backend Guidelines (`backend/`)
- **Package Structure:** `com.utephonehub.backend`
- **Layered Architecture:**
  - **Controller:** (`controller/`) Handle HTTP requests/responses only. No business logic. Return `DTOs`, never Entities.
  - **Service:** (`service/`) Business logic, transaction management (`@Transactional`).
  - **Repository:** (`repository/`) Data access, return `Optional<T>`.
  - **DTO:** (`dto/`) Use `Request`/`Response` suffixes (e.g., `UserResponse`). MapStruct for mapping.
- **Coding Standards:**
  - Use **Lombok** (`@Data`, `@Builder`, `@RequiredArgsConstructor`) to reduce boilerplate.
  - **Dependency Injection:** Always use Constructor Injection via `@RequiredArgsConstructor`. Avoid `@Autowired` on fields.
  - **Exceptions:** Throw custom exceptions (e.g., `ResourceNotFoundException`) handled by `GlobalExceptionHandler`.
  - **Naming:** `PascalCase` for classes, `camelCase` for methods, `snake_case` for DB tables/columns.

## 3. Frontend Guidelines (`frontend/`)
- **Structure:** App Router (`app/`), no `src/` directory for app code (based on actual structure).
- **Components:**
  - Default to **Server Components**. Add `'use client'` only for interactivity (hooks, event listeners).
  - Use **Shadcn/UI** components from `components/ui/`.
  - Use `cn()` utility (clsx + tailwind-merge) for class composition.
- **Styling:** Tailwind CSS 4. Order classes: Layout -> Box Model -> Visual.
- **TypeScript:** Strict typing. No `any`. Use `interface` for models, `type` for props.
- **State Management:** Zustand for client-side global state.

## 4. Critical Workflows
- **Backend Run:** `cd backend` -> `docker-compose up -d --build` (runs DB + Redis + App).
- **Frontend Run:** `cd frontend` -> `npm run dev`.
- **API Docs:** Swagger UI at `http://localhost:8081/swagger-ui/index.html`.
- **Database:** PostgreSQL (Port 5432), Redis (Port 6379).

## 5. Key Files & Paths
- **Backend Entry:** `backend/src/main/java/com/utephonehub/backend/UtePhonehubBackendApplication.java`
- **Frontend Entry:** `frontend/app/page.tsx`
- **API Config:** `backend/src/main/java/com/utephonehub/backend/config/`
- **Frontend Utils:** `frontend/lib/utils.ts` (contains `cn` helper)
- **Docs:** `docs/CONVENTIONS.md` (Detailed coding rules), `docs/PROJECT_STRUCTURE.md`.
