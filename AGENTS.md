# BIA-R — Agent Guide

BIA-R is a SaaS web platform for **Business Impact Analysis (ISO 22317)** and **Risk Management (ISO 31000)**.

---

## Project Structure

```
/
  AGENTS.md
  docker-compose.yml
  frontend/
    Dockerfile
    nginx.conf
    vite.config.ts
    index.html
    package.json
    src/
      app/
        App.tsx
        router.tsx
        layouts/
      features/
        auth/
        instances/
        dashboard/
        organizational-context/
        bia/
        risks/
        reports/
        settings/
      shared/
        api/
          client.ts
          auth.ts
          instances.ts
          context.ts
          bia.ts
          risks.ts
          reports.ts
          comments.ts
          exports.ts
        queries/
          instances.queries.ts
          context.queries.ts
          bia.queries.ts
          risks.queries.ts
          reports.queries.ts
        store/
        types/
        utils/
        ui/
      styles/
      assets/
  backend/
    pom.xml
    Dockerfile
    src/main/java/com/biar/
      config/
      auth/
      organization/
      instance/
      context/
      bia/
      risk/
      report/
      audit/
      comment/
      export/
      shared/
    src/main/resources/
      application.yml
      db/migration/
```

---

## Frontend Stack

| Tool | Purpose |
|---|---|
| Vite | Build tool and dev server |
| React 18 | UI library |
| TypeScript | Type safety |
| React Router v7 | Client-side routing |
| TanStack Query v5 | Server state (data fetching, caching, mutations) |
| Axios | HTTP client for API calls |
| Zustand | UI-only local state (auth, active instance, sidebar, modals) |
| Existing prototype components | Incrementally refactor into features |

## Backend Stack

| Tool | Purpose |
|---|---|
| Spring Boot 4.0.6 | REST API framework |
| Java 21 | LTS with virtual threads |
| Spring Security + JWT | Stateless authentication |
| Spring Data JPA / Hibernate | ORM |
| PostgreSQL 16 | Database |
| Flyway | Versioned database migrations |
| MapStruct | DTO ↔ Entity mapping |
| Lombok | Reduce boilerplate |
| SpringDoc OpenAPI | Auto-generated API docs |
| OpenHTMLToPDF | Server-side PDF generation |

## Infrastructure

| Component | Role |
|---|---|
| Docker Compose | MVP deployment |
| Nginx | Serve frontend static build, SPA fallback, gzip, caching, optional /api reverse proxy |
| PostgreSQL | Primary database |
| pgAdmin (optional) | DB inspection |

---

## Routes

```
/login
/instances
/instances/:instanceId/dashboard
/instances/:instanceId/context
/instances/:instanceId/bia
/instances/:instanceId/risks
/instances/:instanceId/integrated
/instances/:instanceId/reports
/settings
```

Navigation flow: **Login → Instances selector → Instance workspace**

---

## Instance Status Workflow

```
IN_PROGRESS ──(all sections complete)──> COMPLETED
COMPLETED   ──(mark reviewed)──────────> REVIEWED
REVIEWED    ──(mark approved)──────────> APPROVED
REVIEWED    ──(mark disapproved)───────> DISAPPROVED
APPROVED    ──(mark finished)──────────> FINISHED
DISAPPROVED ──(edit critical content)──> IN_PROGRESS
FINISHED    ──(duplicate)──────────────> new IN_PROGRESS
any         ──(archive)────────────────> ARCHIVED
ARCHIVED    ──(restore)────────────────> previous status
```

### Critical analysis changes (reset to IN_PROGRESS):
- Editing organizational context
- Creating or editing business processes
- Editing process activities
- Editing BIA criteria
- Editing MTPD, RTO, RPO
- Editing dependencies
- Editing risks
- Editing probability, impact, or criticality values

### Non-critical changes (do NOT change status):
- Comments
- PDF exports
- Viewing history
- UI filters
- Participant changes

---

## Organizational Context Model

The system is **process-centered**. Business unit is contextual metadata.

A **business process** includes:
- Name
- Business unit / department
- Owner
- Description
- Key objectives
- Country / region
- Sites or locations
- Number of employees involved
- BIA review periodicity
- Critical time period
- Status
- Criticality
- Notes

A process can have **multiple activities**:
- Activity name
- Critical time period
- Notes
- Order index

---

## Database

### Core tables
- organizations
- users
- instances
- instance_participants
- instance_status_history
- instance_activity_logs
- instance_comments
- business_processes
- process_activities
- bia_assessments
- risks
- reports
- instance_exports

### Rules
- Use **JSONB** only for flexible schemas (e.g. BIA impact categories, report snapshots)
- Use **relational tables** for core entities
- Use **enums** for `instance_status`, `risk_level`, `report_type`
- Index `instance_id`, `status`, `process_id`, `created_at`
- All schema changes via **Flyway migrations**

---

## Reports (PDF generation)

Generate via **OpenHTMLToPDF** on backend:
- Instance summary PDF
- Instance history PDF (activity timeline + comments + status changes + participant changes + version changes + export events)
- BIA report PDF
- Risk report PDF
- Executive resilience report PDF

---

## Frontend Conventions

### API layer
- `src/shared/api/client.ts` — Axios instance with base URL, JWT interceptor, 401 redirect
- One file per domain (auth, instances, context, bia, risks, reports, comments, exports)

### Query hooks
- `src/shared/queries/*.queries.ts` — TanStack Query hooks per domain
- Use `useQuery` for reads, `useMutation` for writes

### State
- **TanStack Query** for all server data
- **Zustand** only for UI state: auth user/token, active instance, sidebar, modals, theme, search context

### Components
- Feature-scoped, small, single responsibility
- Avoid `useEffect` for data fetching (use React Query)
- TypeScript types for all API models

### Styling
- Keep existing Tailwind + inline styles from prototype
- Apple-inspired clean SaaS interface
- Responsive: mobile, tablet, laptop, desktop

---

## Nginx Configuration

- Serve Vite production build from `/usr/share/nginx/html`
- SPA fallback: `try_files $uri $uri/ /index.html`
- gzip compression enabled
- Long-lived Cache-Control for hashed assets (`immutable`, 1 year)
- `index.html` uncached or short TTL (no-cache)
- Optional `/api` reverse proxy to backend

---

## Docker Compose

Services:
- `frontend` — multi-stage Dockerfile (node build → nginx serve), port 80 → 3000
- `backend` — Spring Boot JAR, port 8080
- `postgres` — PostgreSQL 16, port 5432
- `pgadmin` — optional, port 5050

---

## Development Order

1. Add React Router routes
2. Add Axios client + TanStack Query provider
3. Add Zustand stores
4. Refactor Login + Instances selector
5. Implement instance workspace routes
6. Organizational Context (process-centered)
7. BIA module
8. Risks module
9. Reports + PDF exports
10. Activity history, comments, status transitions
11. Responsive polish
12. Nginx production serving
13. Docker Compose setup

---

## Future Scaling Path

- Redis for caching
- PgBouncer for connection pooling
- PostgreSQL read replicas
- CDN for static assets
- Observability and centralized logging
- Kubernetes orchestration
- Load balancing

These are NOT part of the MVP. Keep infrastructure simple.

---

## Key Rules for AI Agents

1. **Do NOT rewrite existing UI** — incrementally refactor the prototype
2. **Keep components small** and feature-scoped
3. **No useEffect for data fetching** — use TanStack Query
4. **No duplicated state** — server data in React Query, UI state in Zustand
5. **TypeScript types for all API models** — no `any`
6. **DTOs in backend**, validate requests, consistent error responses
7. **Nginx config must be minimal and documented** — SPA fallback, gzip, caching, optional proxy
8. **MVP infrastructure only** — no Redis, PgBouncer, K8s until explicitly needed
9. **Comments, exports, viewing history, filters must NOT change instance status**
10. **Critical edits must reset status to IN_PROGRESS**
