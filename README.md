# Quản Lý Kỹ Thuật (Technical Management)

Desktop application built with Electron.js for managing technical resources at the Bomb and Mine Technology Center (Trung Tâm Công Nghệ Xử Lý Bom Mìn).

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

- **Electron.js** - Desktop application framework
- **better-sqlite3** - Local SQLite database
- **HTML/CSS/JS** - Frontend (no framework)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Run the Application

```bash
npm start
```

## Project Structure

```
src/
├── main.js                    # Electron main process
├── database.js                # SQLite database layer
├── preload.js                 # Preload script (IPC bridge)
└── renderer/
    ├── index.html             # Main HTML layout
    ├── css/
    │   └── styles.css         # Application styles
    └── js/
        └── app.js             # Frontend application logic
```

## Data Storage

Data is stored locally using SQLite in the user's application data directory. The database is created automatically on first run.
