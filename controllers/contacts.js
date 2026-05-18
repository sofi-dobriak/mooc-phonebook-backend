const contactsRoute = require('express').Router();
const Contact = require('../models/contact');

contactsRoute.get('/', async (req, res, next) => {
  const contacts = await Contact.find({});
  res.json(contacts);
});

contactsRoute.get('/:id', async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);
  contact ? res.json(contact) : res.status(404).end();
});

contactsRoute.post('/', async (req, res, next) => {
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

  const savedContact = await contact.save();
  res.status(201).json(savedContact);
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

contactsRoute.delete('/:id', async (req, res, next) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  contact ? res.status(204).end() : res.status(404).send('Contact not found');
});

module.exports = contactsRoute;
