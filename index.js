require('dotenv').config();

const express = require('express');
const morgan = require('morgan');

const { generateId } = require('./helpers/helpers');

const Persons = require('./models/persons');

const app = express();

app.use(express.json());
app.use(express.static('dist'));

morgan.token('body', req => JSON.stringify(req.body));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

const password = process.argv[2];

app.get('/api/info', (req, res) => {
  let personsCount = `Phonebook has info for ${persons.length} people`;
  let timeRequest = new Date();

  res.send(`${personsCount}\n${timeRequest}`);
});

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => res.send(persons));
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = persons.find(person => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end('Person not found');
  }
});

app.post('/api/persons', (req, res) => {
  const body = req.body;
  const existingPerson = persons.find(person => person.name === body.name);

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'Name or number is missing',
    });
  }

  if (existingPerson) {
    return res.status(400).json({
      error: 'Name must be unique',
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  res.json(person);
});

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  persons = persons.filter(person => person.id !== id);

  res.status(204).end();
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
