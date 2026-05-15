require('dotenv').config();

const express = require('express');
const morgan = require('morgan');

const { generateId } = require('./helpers/helpers');

const Person = require('./models/persons');

const app = express();

app.use(express.json());
app.use(express.static('dist'));

morgan.token('body', req => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/api/info', (req, res, next) => {
  Person.countDocuments({})
    .then(count => res.send(`Phonebook has info for ${count} people\n${new Date()}`))
    .catch(error => next(error));
});

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => res.send(persons))
    .catch(error => next(error));
});

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => (person ? res.json(person) : res.status(404).end()))
    .catch(error => next(error));
});

app.post('/api/persons', (req, res, next) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'Name or number is missing',
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then(savedNote => res.json(savedNote))
    .catch(error => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body;

  Person.findById(req.params.id)
    .then(person => {
      if (!person) return res.status(404).end();

      person.name = name;
      person.number = number;

      return person
        .save()
        .then(updatePerson => res.json(updatePerson))
        .catch(error => next(error));
    })
    .catch(error => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(person => (person ? res.status(204).end() : res.status(404).send('Person not found')))
    .catch(error => next(error));
});

const errorHandler = (err, req, res, next) => {
  console.log(err.message);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: `validation error: ${err.message}` });
  }

  if (err.name === 'DocumentNotFoundError') {
    return res.status(404).json({ error: 'not found' });
  }

  if (err.name === 'MongoServerError' && err.code === 11000) {
    return res.status(400).json({ error: 'name must be unqie' });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'wrong id format' });
  }

  next(err);
};

const unknownEndpoint = (req, res) => {
  return res.status(404).send('Unknown endpoint');
};

app.use(errorHandler);
app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
