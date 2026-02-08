// app.js - Optional launcher; use "npm run dev" (next dev) for standard setup.
// This file exists for compatibility. Next.js API routes handle all backend logic.
require('dotenv').config();
const { spawn } = require('child_process');
const dev = process.env.NODE_ENV !== 'production';
spawn('npx', ['next', dev ? 'dev' : 'start'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: process.env.PORT || 3000 }
});
