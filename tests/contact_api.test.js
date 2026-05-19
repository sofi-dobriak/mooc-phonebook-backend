const { test, after, beforeEach, describe } = require("node:test");
const assert = require("assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const helpers = require("./test_helpers");

const api = supertest(app);

const Contact = require("../models/contact");
const User = require("../models/user");

describe("tests for contacts", () => {
  beforeEach(async () => {
    await Contact.deleteMany({});
    await Contact.insertMany(helpers.initialContacts);
  });

  test("contacts are returned as json", async () => {
    await api
      .get("/api/contacts")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all contacts are returned", async () => {
    const response = await api.get("/api/contacts");
    assert.strictEqual(response.body.length, helpers.initialContacts.length);
  });

  test("a specific contact is within the returned contacts", async () => {
    const response = await api.get("/api/contacts");

    const names = response.body.map((contact) => contact.name);
    assert(names.includes("Test Person"));
  });

  test("a valid contact can be added", async () => {
    const newContact = {
      name: "Contact 3",
      number: "040-456123",
    };

    await api
      .post("/api/contacts")
      .send(newContact)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const contactsAtEnd = await helpers.contactsInDB();
    assert.strictEqual(
      contactsAtEnd.length,
      helpers.initialContacts.length + 1,
    );

    const names = contactsAtEnd.map((contact) => contact.name);
    assert(names.includes("Contact 3"));
  });

  test("contact without name is not added", async () => {
    const newContact = {
      name: "Contact 4",
    };

    await api.post("/api/contacts").send(newContact).expect(400);

    const contactsAtEnd = await helpers.contactsInDB();
    assert.strictEqual(contactsAtEnd.length, helpers.initialContacts.length);
  });

  test("contact without number is not added", async () => {
    const newContact = {
      number: "000-000000",
    };

    await api.post("/api/contacts").send(newContact).expect(400);

    const contactsAtEnd = await helpers.contactsInDB();
    assert.strictEqual(contactsAtEnd.length, helpers.initialContacts.length);
  });

  test("a specific contact can be viewed", async () => {
    const contacts = await helpers.contactsInDB();
    const contactToView = contacts[0];

    const response = await api
      .get(`/api/contacts/${contactToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.deepStrictEqual(response.body, contactToView);
  });

  test("a contact can be deleted", async () => {
    const contactsAtStart = await helpers.contactsInDB();
    const contactToDelete = contactsAtStart[0];

    await api.delete(`/api/contacts/${contactToDelete.id}`).expect(204);

    const contactsAtEnd = await helpers.contactsInDB();

    const ids = contactsAtEnd.map((contact) => contact.id);
    assert(!ids.includes(contactToDelete.id));

    assert.strictEqual(
      contactsAtEnd.length,
      helpers.initialContacts.length - 1,
    );
  });
});

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const hashPassword = await bcrypt.hash("secret", 10);
    const user = new User({ username: "root", name: "root", hashPassword });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helpers.usersInDB();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helpers.usersInDB();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((user) => user.username);
    assert(usernames.includes(newUser.username));
  });

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helpers.usersInDB();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helpers.usersInDB();
    assert(result.body.error.includes("username must be unique"));

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});

after(async () => await mongoose.connect.close());
