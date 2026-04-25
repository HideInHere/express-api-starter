# express-api-starter

A minimal, production-ready Express.js API template with essential middleware, error handling, and request validation built-in.

## Features

- Express.js with modern async/await patterns
- Request validation with Joi
- Structured error handling
- CORS and compression middleware
- Environment configuration with dotenv
- Request logging with Morgan
- ESLint configuration

## Installation

```bash
git clone https://github.com/yourusername/express-api-starter.git
cd express-api-starter
npm install
```

## Quick Start

```bash
cp .env.example .env
npm run dev
```

The server runs on `http://localhost:3000` by default.

## Usage Example

```javascript
const { Router } = require('express');
const { validateRequest } = require('../middleware/validation');

const router = Router();

router.get('/users/:id', async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
```

## Scripts

- `npm run dev` - Start development server with hot-reload
- `npm start` - Start production server
- `npm test` - Run test suite
- `npm run lint` - Run ESLint

## License

MIT