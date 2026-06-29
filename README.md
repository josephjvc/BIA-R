# BIA-R

**Business Impact Analysis (ISO 22317) and Risk Management (ISO 31000)**

SaaS platform for Peruvian consumer goods companies. Built with React + Spring Boot.

## Architecture

```
BIA-R/
├── frontend/     React 18 + TypeScript + Vite 6
├── backend/      Spring Boot 4.0.6 + Java 21
└── docker-compose.yml
```

## Quick Start

```bash
# 1. Copy environment template
cp .env.example .env

# 2. Edit .env with your secrets
#    (default values work for local development)

# 3. Build and run
docker compose up -d --build
```

### Access

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080 |
| API Docs | http://localhost:8080/swagger-ui.html |
| pgAdmin | http://localhost:5050 (admin@biar.com / admin) |

### Test Credentials

Create a new account at `/login` or use the existing test user:
- Email: `test@test.com`
- Password: `Test1234!`

## Stack

### Frontend

| Tool | Purpose |
|------|---------|
| Vite 6 | Build tool and dev server |
| React 18 | UI library |
| TypeScript | Type safety |
| React Router v7 | Client-side routing |
| TanStack Query v5 | Server state (data fetching, caching, mutations) |
| Axios | HTTP client for API calls |
| Zustand v5 | UI-only local state (auth, active instance, sidebar) |
| Tailwind CSS v4 | Utility-first styling |
| Recharts | Charts and data visualization |
| shadcn/ui + Radix UI | Accessible UI primitives |

### Backend

| Tool | Purpose |
|------|---------|
| Spring Boot 4.0.6 | REST API framework |
| Java 21 | LTS with virtual threads |
| Spring Security + JWT | Stateless authentication |
| Spring Data JPA / Hibernate | ORM |
| PostgreSQL 16 | Database |
| Flyway | Versioned database migrations |
| MapStruct | DTO ↔ Entity mapping |
| Apache PDFBox | PDF report generation |
| OpenAPI (SpringDoc) | API documentation |

## Development

### Frontend

```bash
cd frontend
corepack enable
pnpm install
pnpm dev
```

### Backend

Requires PostgreSQL on `localhost:5432` with database `biar`.

```bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

## Database Migrations

| Version | Description |
|---------|-------------|
| V1 | Initial schema: all tables, enums, indexes |
| V2 | Make organization_id nullable, participant index |
| V3 | Convert instance_status enum to VARCHAR |
| V4 | Add file_path column to instance_exports |
| V5 | Convert report_type and risk_level enums to VARCHAR |

## API Endpoints

| Module | Base Path | Description |
|--------|-----------|-------------|
| Auth | `/api/auth` | Register and login |
| Instances | `/api/instances` | CRUD, status transitions, participants |
| Context | `/api/instances/{id}/processes` | Business processes and activities |
| BIA | `/api/instances/{id}/bia` | Business impact assessments |
| Risks | `/api/instances/{id}/risks` | Risk register and matrix |
| Reports | `/api/instances/{id}/reports` | PDF report generation |
| Dashboard | `/api/instances/{id}/dashboard` | KPIs and charts |
| Exports | `/api/instances/{id}/exports` | CSV export |
| Comments | `/api/instances/{id}/comments` | Instance comments |
| Users | `/api/users` | User profile |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `JWT_SECRET` | (required) | Base64-encoded 256-bit key for JWT signing |
| `POSTGRES_PASSWORD` | `biar_dev` | PostgreSQL password |
| `PGADMIN_EMAIL` | `admin@biar.com` | pgAdmin login email |
| `PGADMIN_PASSWORD` | `admin` | pgAdmin login password |
| `APP_EXPORTS_DIR` | `./exports` | Directory for generated PDFs and CSVs |

## License

MIT
