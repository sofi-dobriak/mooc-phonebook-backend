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
  Person.findById(req.params.id).then(person => res.send(person));
});

app.post('/api/persons', (req, res) => {
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

  person.save().then(savedNote => res.json(savedNote));
});

app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndDelete(req.params.id).then(() => res.status(204).end());
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
