const contactsRoute = require('express').Router();
const Contact = require('../models/contact');

contactsRoute.get('/', (req, res, next) => {
  Contact.find({})
    .then(contacts => res.send(contacts))
    .catch(error => next(error));
});

contactsRoute.get('/:id', (req, res, next) => {
  Contact.findById(req.params.id)
    .then(contact => (contact ? res.json(contact) : res.status(404).end()))
    .catch(error => next(error));
});

contactsRoute.post('/', (req, res, next) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'Name or number is missing',
    });
  }

  const contact = new Contact({
    name: body.name,
    number: body.number,
  });

  contact
    .save()
    .then(savedContact => res.json(savedContact))
    .catch(error => next(error));
});

contactsRoute.put('/:id', (req, res, next) => {
  const { name, number } = req.body;

  Contact.findById(req.params.id)
    .then(contact => {
      if (!contact) return res.status(404).end();

      contact.name = name;
      contact.number = number;

      return contact
        .save()
        .then(updateContact => res.json(updateContact))
        .catch(error => next(error));
    })
    .catch(error => next(error));
});

contactsRoute.delete('/:id', (req, res, next) => {
  Contact.findByIdAndDelete(req.params.id)
    .then(contact => (contact ? res.status(204).end() : res.status(404).send('Contact not found')))
    .catch(error => next(error));
});

module.exports = contactsRoute;
