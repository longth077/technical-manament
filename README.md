# Technical Management

Separated backend/frontend implementation for technical management.

## Stack
- Backend (legacy): Node.js 22, Express, Sequelize ORM, MySQL 8.4.8
- Backend (new): Go, Gin, GORM, MySQL 8.4.8
- Frontend: React (Vite)

## Default admin
- Username: `admin`
- Email: `thanhpxd49@gmail.com`
- Password: `dank4920132018`

## Backend
```bash
cd backend
cp .env.example .env
npm install
npm start
```

## Backend (Go + Gin + GORM)
```bash
cd backend-go
cp .env.example .env
go mod tidy
go run ./cmd/server
```

Notes:
- API route structure follows the previous backend (`/api/auth`, `/api/admin`, `/api/entities`, `/api/enums`).
- SQL and CSV import/export are implemented.
- Excel/report export-import endpoints currently return `501 Not Implemented`.

## Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Implemented capabilities
- Basic authentication with encrypted passwords (bcrypt)
- Signup with admin approval workflow
- Admin page actions: approve signup, delete user, assign role (`admin`, `user`, `readonly`)
- Role enforcement: `readonly` can view only; `user` and `admin` can edit entities
- Controller/service/repository layer with ORM for MySQL
- Generic CRUD APIs for entities in `database-schema.sql`
- Admin data transfer: export/import all data in SQL and Excel
- Per-entity report export to Excel for `admin` and `user`
- React UI with validation, API service layer, entity pages, admin screens, and export actions
