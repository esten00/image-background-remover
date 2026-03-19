// Simple server to serve the Next.js app
const express = require('express');
const next = require('next');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const port = parseInt(process.env.PORT, 10) || 3001;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Environment variables
require('dotenv').config({ path: '.env.local' });

app.prepare().then(() => {
  const server = express();

  // Proxy API requests to handle CORS during development
  server.use('/api/remove', createProxyMiddleware({
    target: 'https://api.remove.bg',
    changeOrigin: true,
    pathRewrite: {
      '^/api/remove': '/v1.0/removebg',
    },
    headers: {
      'X-Api-Key': process.env.REMOVEBG_API_KEY,
    },
  }));

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});