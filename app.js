const express = require('express');
const mongoose = require('mongoose');
const blogRoute = require('./controllers/blogList.js');
const middleware = require('./utils/middleware.js');
const config = require('./utils/config');

const app = express();

mongoose.connect(config.URL, { family: 4 });

app.use(express.json());

app.use('/api/blogs', blogRoute);

app.use(middleware.errorHandler);
app.use(middleware.unknownEndpoint);

module.exports = app;
