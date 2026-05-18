const { test, after, beforeEach } = require('node:test');
const assert = require('assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helpers = require('./test_helpers');

const api = supertest(app);

const Contact = require('../models/contact');

beforeEach(async () => {
  await Contact.deleteMany({});
  await Contact.insertMany(helpers.initialContacts);
});

test('contacts are returned as json', async () => {
  await api
    .get('/api/contacts')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('all contacts are returned', async () => {
  const response = await api.get('/api/contacts');
  assert.strictEqual(response.body.length, helpers.initialContacts.length);
});

test('a specific contact is within the returned contacts', async () => {
  const response = await api.get('/api/contacts');

  const names = response.body.map(contact => contact.name);
  assert(names.includes('Test Person'));
});

test('a valid contact can be added', async () => {
  const newContact = {
    name: 'Contact 3',
    number: '040-456123',
  };

  await api
    .post('/api/contacts')
    .send(newContact)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const contactsAtEnd = await helpers.contactsInDB();
  assert.strictEqual(contactsAtEnd.length, helpers.initialContacts.length + 1);

  const names = contactsAtEnd.map(contact => contact.name);
  assert(names.includes('Contact 3'));
});

test('contact without name is not added', async () => {
  const newContact = {
    name: 'Contact 4',
  };

  await api.post('/api/contacts').send(newContact).expect(400);

  const contactsAtEnd = await helpers.contactsInDB();
  assert.strictEqual(contactsAtEnd.length, helpers.initialContacts.length);
});

test('contact without number is not added', async () => {
  const newContact = {
    number: '000-000000',
  };

  await api.post('/api/contacts').send(newContact).expect(400);

  const contactsAtEnd = await helpers.contactsInDB();
  assert.strictEqual(contactsAtEnd.length, helpers.initialContacts.length);
});

test('a specific contact can be viewed', async () => {
  const contacts = await helpers.contactsInDB();
  const contactToView = contacts[0];

  const response = await api
    .get(`/api/contacts/${contactToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  assert.deepStrictEqual(response.body, contactToView);
});

test('a contact can be deleted', async () => {
  const contactsAtStart = await helpers.contactsInDB();
  const contactToDelete = contactsAtStart[0];

  await api.delete(`/api/contacts/${contactToDelete.id}`).expect(204);

  const contactsAtEnd = await helpers.contactsInDB();

  const ids = contactsAtEnd.map(contact => contact.id);
  assert(!ids.includes(contactToDelete.id));

  assert.strictEqual(contactsAtEnd.length, helpers.initialContacts.length - 1);
});

after(async () => await mongoose.connect.close());
