const infoRoute = require('express').Router();
const Contact = require('../models/contact');

infoRoute.get('/', (req, res, next) => {
  Contact.countDocuments({})
    .then(count => res.send(`Phonebook has info for ${count} people\n${new Date()}`))
    .catch(error => next(error));
});

module.exports = infoRoute;
