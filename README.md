# express-api-starter

A minimal, production-ready REST API starter template built with Node.js and Express. Includes request validation, error handling, and environment configuration out of the box.

## Features

- Express.js server with async/await support
- Request validation middleware
- Centralized error handling
- Environment configuration (.env support)
- CORS enabled
- Request logging

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
```

## Running

```bash
npm start          # Production
npm run dev        # Development with hot reload
npm test           # Run tests
```

## Usage Example

```javascript
const express = require('express');
const app = require('./src/app');

app.get('/api/users/:id', (req, res) => {
  res.json({ id: req.params.id, name: 'John Doe' });
});

app.listen(process.env.PORT || 3000);
```

## License

MIT