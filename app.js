const mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan');
const config = require('./utils/config');
const logger = require('./utils/logger');
const contactsRoute = require('./controllers/contacts');
const infoRoute = require('./controllers/info');
const middleware = require('./utils/middleware');

const app = express();

logger.info('connecting to', config.URL);

mongoose
  .connect(config.URL, { family: 4 })
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch(error => {
    logger.error('error connecting to MongoDB:', error.message);
  });

app.use(express.json());
app.use(express.static('dist'));

morgan.token('body', req => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.use('/api/info', infoRoute);
app.use('/api/contacts', contactsRoute);

app.use(middleware.errorHandler);
app.use(middleware.unknownEndpoint);

module.exports = app;
