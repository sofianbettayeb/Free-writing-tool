# Journal Application

## Overview

A modern full-stack journaling application built with React, Express, and PostgreSQL. The application provides a rich text editor with features like font customization, export functionality, and a timer for focused writing sessions. Users can create, edit, search, and organize their journal entries with an intuitive sidebar interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Components**: Shadcn/UI component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Rich Text Editor**: TipTap editor with extensions for links, images, and formatting
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Local Storage**: Custom hooks for persisting draft entries locally

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API following standard HTTP methods
- **Error Handling**: Centralized error handling middleware
- **Request Logging**: Custom middleware for API request logging
- **Development**: Hot reload support with Vite integration

### Data Layer
- **Database**: PostgreSQL as primary database
- **ORM**: Drizzle ORM for type-safe database queries and schema management
- **Schema**: Single table for journal entries with fields for title, content, word count, and timestamps
- **Migration**: Drizzle migrations for schema versioning
- **Fallback Storage**: In-memory storage implementation for development/testing

### Component Architecture
- **Design System**: Comprehensive UI component library with variants
- **Layout**: Resizable sidebar with main content area
- **Editor Features**: Multiple font options, word counting, export functionality
- **Search**: Real-time search across journal entries
- **Timer**: Pomodoro-style writing timer with notifications

### Authentication & Security
- Currently no authentication system implemented
- Application assumes single-user setup
- Local storage used for draft persistence

## External Dependencies

### Frontend Libraries
- **TipTap**: Rich text editor with extensible plugin system
- **Radix UI**: Headless UI components for accessibility
- **TanStack Query**: Server state management and caching
- **date-fns**: Date manipulation and formatting
- **Wouter**: Lightweight routing library
- **Tailwind CSS**: Utility-first CSS framework
- **Class Variance Authority**: Component variant management

### Backend Dependencies
- **Drizzle ORM**: Type-safe PostgreSQL ORM
- **Neon Database**: Serverless PostgreSQL hosting
- **Zod**: Runtime type validation for API schemas

### Development Tools
- **Vite**: Fast build tool and dev server
- **TypeScript**: Static type checking
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind integration

### Cloud Services
- **Neon Database**: Managed PostgreSQL database service
- **Replit Integration**: Development environment optimizations