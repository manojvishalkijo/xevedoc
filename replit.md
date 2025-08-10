# Overview

XeveDoc is a full-stack web application built with React, TypeScript, and Express.js. The project demonstrates a modern web development stack with a React frontend using Vite for development, shadcn/ui for UI components, and an Express.js backend with PostgreSQL database integration via Drizzle ORM. The application appears to be a documentation or content management platform that has been successfully modernized to use ES modules and the latest tooling configurations.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation resolvers

## Backend Architecture
- **Runtime**: Node.js with ES modules
- **Framework**: Express.js for REST API endpoints
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Session Management**: Built-in storage interface with in-memory implementation
- **Development Server**: Custom Vite integration for hot module replacement

## Data Layer
- **Database**: PostgreSQL with Neon Database serverless driver
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Type Safety**: Drizzle Zod for runtime validation of database schemas
- **Connection**: Uses DATABASE_URL environment variable for connection string

## Development Workflow
- **Module System**: ES modules throughout (package.json specifies "type": "module")
- **TypeScript**: Strict configuration with path mapping for clean imports
- **PostCSS**: Configured with Tailwind CSS plugin for styling processing
- **Hot Reload**: Vite middleware integrated into Express server for development

## Project Structure
- `client/`: React frontend application with Vite configuration
- `server/`: Express.js backend with API routes and middleware
- `shared/`: Common TypeScript schemas and types used by both frontend and backend
- `components.json`: shadcn/ui configuration for component generation
- Root-level configuration files for various tools (Tailwind, TypeScript, Drizzle, etc.)

## Authentication & Authorization
- Basic user schema defined with username/password fields
- Storage interface abstraction allows for different storage implementations
- Session management infrastructure in place but not fully implemented

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL database provider
- **Drizzle ORM**: Type-safe ORM for database operations and migrations

## UI & Styling
- **Radix UI**: Headless component primitives for accessibility and functionality
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Icon library for consistent iconography
- **shadcn/ui**: Pre-built component library built on Radix UI and Tailwind

## Development Tools
- **Vite**: Fast build tool and development server
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form state management and validation
- **Zod**: Runtime schema validation
- **TypeScript**: Static type checking

## Routing & Navigation
- **Wouter**: Lightweight client-side routing library

## Build & Development
- **PostCSS**: CSS processing with Tailwind integration
- **ESBuild**: Fast JavaScript bundler for production builds
- **tsx**: TypeScript execution for development server

## Replit Integration
- **Replit Vite Plugins**: Runtime error overlay and cartographer for Replit development environment
- **Replit Banner**: Development environment integration script