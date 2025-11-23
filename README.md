# UTE Phone Hub

## Clone Repository

```bash
git clone <repository-url>
cd ute-phonehub
```

## Backend Setup

```bash
cd backend
docker-compose up -d
./mvnw spring-boot:run
```

Backend chạy tại: `http://localhost:8081`

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend chạy tại: `http://localhost:3000`

