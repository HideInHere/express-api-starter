# express-api-starter

A minimal, production-ready Express.js API template with built-in error handling, request validation, and environment configuration.

## Features

- Express.js server with middleware setup
- Environment variable configuration
- Request validation and error handling
- Structured routing and controllers
- CORS and security headers enabled
- Winston logger integration

## Installation

```bash
git clone https://github.com/yourusername/express-api-starter.git
cd express-api-starter
npm install
```

## Setup

Create a `.env` file in the root directory:

```
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
```

## Usage

Start the development server:

```bash
npm run dev
```

Make a request to the API:

```bash
curl http://localhost:3000/api/health
```

## Scripts

- `npm run dev` - Start with nodemon
- `npm start` - Start production server
- `npm test` - Run test suite

## License

MIT