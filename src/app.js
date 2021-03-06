#!/usr/bin/env node
'use strict';

const express = require('express');

const { CONFIG, REDIS_CONFIG } = require('./config');
const { healthCheckRouter, AppController } = require('./controllers');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(['/', '/api'], function(req, res, next) {
  res.json({
    success: true,
    message: 'Server is Running'
  });
});

// Adding routes
app.use(CONFIG['BASE_PATH'], healthCheckRouter);
app.use(`${CONFIG['BASE_PATH']}/stats`, AppController.stats);

// Adding 404 route
app.get('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Resource not found' });
});

app.use(function(error, req, res, next) {
  console.error(error.stack);

  const response = {
    success: false,
    errors: error.stack
  };
  res.status(500).json(response);
});

if (require.main == module) {
  app.listen(CONFIG['PORT'], _ => {
    console.log(`[+] App Server started on ${CONFIG['PORT']}`);
  });
}

process.on('SIGINT', function() {
  process.exit();
});

module.exports = {
  app
};
