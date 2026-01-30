# Free Writing Tool

A distraction-free writing application with a clean, minimal interface. Write, organize with tags, and export your work.

## Features

- **Rich text editor** with formatting (bold, italic, underline, lists, links, images)
- **Tag-based organization** for filtering and finding entries
- **Multiple fonts** - Inter, Charter, JetBrains Mono, and more
- **Writing timer** for focused sessions (5-60 minutes)
- **Export options** including ChatGPT-optimized format
- **Keyboard shortcuts** - Cmd/Ctrl+B (bold), Cmd/Ctrl+I (italic), Cmd/Ctrl+/ (show all shortcuts)
- **Auto-save** with local draft persistence

## Tech Stack

- **Frontend**: React, TypeScript, Vite, TailwindCSS, TipTap editor
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL (Neon)
- **ORM**: Drizzle

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or use Neon)

### Installation

```bash
# Clone the repository
git clone https://github.com/sofianbettayeb/Free-writing-tool.git
cd Free-writing-tool

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL
```

### Environment Variables

Create a `.env` file:

```
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
LOCAL_DEV=true
```

### Running Locally

```bash
# Start the development server
PORT=3001 npm run dev
```

The app will be available at http://localhost:3001

Note: Port 5000 is used by macOS AirPlay Receiver, so use a different port like 3001.

## Project Structure

```
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # UI components (editor, sidebar, timer)
│   │   ├── pages/        # Page components (journal, landing)
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utilities
├── server/               # Express backend
│   ├── routes.ts         # API routes
│   ├── db.ts             # Database connection
│   └── storage.ts        # Data access layer
└── shared/               # Shared types and schemas
```

## License

MIT
