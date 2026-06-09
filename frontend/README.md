# BIA-R

**Business Impact Analysis and Risk Management** platform for Peruvian consumer goods companies. ISO 22317 / ISO 31000 compliant.

## Architecture

```
BIA-R/
├── frontend/     React + Vite + TypeScript SPA
├── backend/      Spring Boot 3.4 + Java 21 API
└── docker-compose.yml
```

## Quick start

```bash
docker compose up
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- API docs: http://localhost:8080/swagger-ui.html

## Development

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

### Backend

```bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

Requires a PostgreSQL instance on `localhost:5432` with database `biar`.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 6, Tailwind 4, MUI 7, Radix UI, Recharts |
| Backend | Spring Boot 3.4, JPA / Hibernate, Spring Security (JWT), Flyway |
| Database | PostgreSQL 16 |
| Infrastructure | Docker Compose, Nginx |
