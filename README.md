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

## Running the Application

### Development Mode

Development mode opens the app with DevTools enabled, making it easy to inspect the UI, debug issues, and iterate quickly.

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start in development mode:**

   ```bash
   npm run dev
   ```

   This launches the Electron app with Chrome DevTools open and watches for runtime errors in the console.

3. **Hot-reload workflow:**
   - Edit any file under `src/renderer/` (HTML, CSS, JS) and press `Ctrl+R` / `Cmd+R` in the app window to reload.
   - Changes to `src/main.js`, `src/preload.js`, or `src/database.js` require restarting the process (`Ctrl+C` then `npm run dev`).

### Production Mode

Production mode runs the app without DevTools and is used for distributing or demoing the application.

1. **Start in production mode:**

   ```bash
   npm start
   ```

2. **Package for distribution:**

   To create a distributable installer for the current platform:

   ```bash
   npm run package
   ```

   The output will be placed in the `dist/` directory.

### Environment Summary

| Aspect              | Development (`npm run dev`) | Production (`npm start` / packaged) |
|---------------------|-----------------------------|--------------------------------------|
| DevTools            | Open by default             | Closed                               |
| Database location   | `userData` directory        | `userData` directory                 |
| Source maps         | Available                   | Not included in packaged builds      |
| Recommended for     | Debugging, feature work     | Demo, deployment, distribution       |

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
