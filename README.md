# express-api-starter

A lightweight, production-ready starter template for building RESTful APIs with Node.js and Express. Includes essential middleware, error handling, and a structured project layout.

## Features

- Express.js setup with common middleware
- Centralized error handling
- Environment-based configuration
- Request validation and sanitization
- CORS and rate limiting configured
- Docker support included

## Installation

```bash
git clone https://github.com/yourusername/express-api-starter.git
cd express-api-starter
npm install
cp .env.example .env
```

## Quick Start

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## Example Usage

```javascript
const app = require('./app');

app.get('/api/users/:id', (req, res) => {
  res.json({ id: req.params.id, name: 'John Doe' });
});
```

## Project Structure

```
src/
├── routes/
├── middleware/
├── controllers/
├── utils/
└── server.js
```

## License

MIT