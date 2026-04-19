# Technical Management

Separated backend/frontend implementation for technical management.

## Stack
- Backend: Node.js 22, Express, Sequelize ORM, MySQL 8.4.8
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
