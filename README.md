# express-api-starter

A lightweight Express.js REST API boilerplate with best practices for building scalable Node.js applications. Includes middleware setup, error handling, and environment configuration.

## Features

- Express 4.x server with modern middleware
- Environment configuration with dotenv
- Centralized error handling
- CORS and security headers enabled
- Request logging with morgan
- Example routes and controllers structure

## Prerequisites

- Node.js 16+ and npm

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

2. Configure environment variables:
```
PORT=3000
NODE_ENV=development
```

## Usage

Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### Example Request

```bash
curl -X GET http://localhost:3000/api/health
```

Response:
```json
{"status": "ok", "timestamp": "2024-01-15T10:30:00Z"}
```

## Project Structure

```
src/
├── controllers/
├── routes/
├── middleware/
├── utils/
└── server.js
```

## License

MIT