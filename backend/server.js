// backend/server.js

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const widget = require('./widget');
require('dotenv').config();
const config = require('./config');
const ai = require('./ai');

// Import your modular routes and logic
const webhookRouter = require('./webhook');
// In the future, you might add:
// const botRoutes = require('./bot');
// const aiUtils = require('./ai');

const app = express();

// Security and parsing middleware
app.use(helmet());
app.use(cors());
app.use(express.json());        // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse form data

// Mount your webhook router
app.use('/webhook', webhookRouter);

// Optional: Test route for server health
app.get('/', (req, res) => {
  res.send('DeployGuard backend is running.');
});

// Catch-all error handler (simple for now)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error');
});

//Config
app.get('/api/config', (req, res) => {
  res.json(config);
});

// Example: Simple endpoint for widget/dashboard (will use later)
app.get('/api/dashboard', (req, res) => {
  const data = widget.getDashboardData();
  res.json(data);
});
//AI
app.post('/api/explainlog', async (req, res) => {
  const { logText } = req.body;
  const summary = await ai.explainLog(logText || '');
  res.send(summary);
});

// Set the port for cloud or local
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`DeployGuard backend listening on port ${PORT}`);
});
