# Quản Lý Kỹ Thuật (Technical Management)

Web-based application for managing technical resources at the Bomb and Mine Technology Center (Trung Tâm Công Nghệ Xử Lý Bom Mìn).

## Features

- **Tổng Quan Khu Kỹ Thuật (Technical Area Overview)**: Manage location, area, systems info
- **Danh Sách Cán Bộ (Staff List)**: Track personnel with rank, position, assignments
- **Kho Trạm Xưởng (Warehouses/Workshops)**: Full warehouse management including:
  - Equipment and materials tracking
  - Inspection records
  - Entry/exit registration
  - Temporary handover management
  - Import/export operations
  - Lightning protection records
- **Vũ Khí Trang Bị (Weapons/Equipment)**: Weapons inventory
- **Trang Thiết Bị Kỹ Thuật (Technical Equipment)**: Equipment tracking with hours
- **Phương Tiện (Vehicles)**: Vehicle fleet management
- **Vật Tư (Materials)**: Materials inventory

## Tech Stack

- **Node.js + Express** - Backend server and APIs
- **better-sqlite3** - Local SQLite database
- **HTML/CSS/JS** - Frontend (no framework)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

## Running the Application

```bash
npm start
```

The server runs at `http://localhost:3000`.

## Project Structure

```
server.js                      # Express server entry point
public/                        # Static frontend pages and assets
src/
├── auth-database.js           # Authentication database setup
├── database.js                # SQLite database layer
├── middleware/
│   └── auth.js                # Auth middleware
└── routes/
    └── auth.js                # Auth routes
```

## Data Storage

Data is stored locally using SQLite in the `data/` directory. The database is created automatically on first run.
