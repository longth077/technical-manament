# Quản Lý Kỹ Thuật - Technical Management System

A web-based technical/military management system with separate backend and frontend.

## Architecture

```
technical-manament/
├── backend/          # Express.js REST API (Node.js 22, Sequelize, MySQL)
│   └── src/
│       ├── config/       # Database configuration
│       ├── models/       # Sequelize models
│       ├── repositories/ # Data access layer
│       ├── services/     # Business logic layer
│       ├── controllers/  # Request handling layer
│       ├── validators/   # Input validation (express-validator)
│       ├── middleware/    # Auth & error handling middleware
│       ├── routes/       # API route definitions
│       └── server.js     # Entry point
├── frontend/         # React SPA (Vite, React Router)
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── context/      # React Context (Auth)
│       ├── pages/        # Page components
│       ├── services/     # API service layer
│       └── App.jsx       # Root component with routing
└── package.json      # Root scripts
```

## Prerequisites

- **Node.js** >= 22.0.0
- **MySQL** >= 8.0

## Setup

### 1. Database

Create a MySQL database:

```sql
CREATE DATABASE technical_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend Configuration

```bash
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials
```

### 3. Install Dependencies

```bash
# From root
npm run install:all

# Or individually
npm run install:backend
npm run install:frontend
```

### 4. Run

```bash
# Start backend (port 3000)
npm run start:backend

# Start frontend dev server (port 3001)
npm run start:frontend
```

### 5. Build Frontend for Production

```bash
npm run build:frontend
```

## Features

- **Authentication**: Sign up, sign in, session-based auth with bcrypt password hashing
- **Unit Info**: Manage unit/organization information
- **Technical Area Overview**: Position, area, systems, certifications
- **Staff Management**: Personnel records with assignments
- **Warehouse Management**: Warehouses with sub-modules for equipment, inspections, access logs, handover, import/export, lightning protection
- **Weapons Management**: Weapons inventory tracking
- **Technical Equipment**: Equipment records with operating hours
- **Vehicles**: Vehicle fleet management with mileage
- **Materials**: Material inventory management

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Register |
| POST | /api/auth/signin | Login |
| POST | /api/auth/logout | Logout |
| GET | /api/auth/me | Current user |
| GET/PUT | /api/unit-info | Unit info |
| GET/PUT | /api/overview | Technical area overview |
| CRUD | /api/staff | Staff management |
| CRUD | /api/warehouses | Warehouse management |
| CRUD | /api/warehouses/:id/{equipment,inspections,...} | Warehouse sub-tables |
| CRUD | /api/weapons | Weapons |
| CRUD | /api/tech-equipment | Technical equipment |
| CRUD | /api/vehicles | Vehicles |
| CRUD | /api/materials | Materials |
