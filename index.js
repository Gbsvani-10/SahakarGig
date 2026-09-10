// Vercel Serverless Function entrypoint
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Mount the Backend API routes
const apiRouter = require('../Backend/routes/api');
app.use('/api', apiRouter);

// Fallback for requests routed directly without /api prefix
app.use('/', apiRouter);

module.exports = app;
