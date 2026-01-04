# UTE Phone Hub

## Requirements

- Java 17
- Node.js
- Docker Desktop
- Git

## Clone Repository

```bash
git clone https://github.com/darktheDE/ute-phonehub
cd ute-phonehub
```

## Backend Setup

```bash
cd backend
docker compose down -v
docker volume rm backend_postgres_data #(nếu cần reset database)
docker compose up -d --build
```

- Backend chạy tại: `http://localhost:8081`
- API Backend Test tại: `http://localhost:8081/swagger-ui/index.html`

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend chạy tại: `http://localhost:3000`

