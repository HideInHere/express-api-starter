# express-api-starter

A lightweight, production-ready Express.js API template with built-in middleware, error handling, and environment configuration.

## Features

- Express.js server setup with best practices
- Environment variable management with dotenv
- CORS and request logging middleware
- Global error handling middleware
- Health check endpoint
- Request validation utilities
- Modular route structure

## Prerequisites

- Node.js 16+
- npm or yarn

## Installation

```bash
git clone https://github.com/yourusername/express-api-starter.git
cd express-api-starter
npm install
```

## Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update environment variables in `.env`

## Usage

Start the development server:
```bash
npm run dev
```

Production build:
```bash
npm start
```

The API will be available at `http://localhost:3000`

## API Endpoints

- `GET /health` - Server health check
- `GET /api/users` - List all users
- `POST /api/users` - Create new user

## Project Structure

```
src/
├── routes/
├── middleware/
├── controllers/
└── utils/
```

## License

MIT