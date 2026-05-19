const Contact = require("../models/contact");
const User = require("../models/user");

const initialContacts = [
  { name: "Test Person", number: "040-123456" },
  { name: "Another Person", number: "050-654321" },
];

const nonExistingID = async () => {
  const newContact = new Contact({ name: "No name" });
  await newContact.save();
  await newContact.deleteOne();

  return newContact._id.toString();
};

const usersInDB = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

const contactsInDB = async () => {
  const contacts = await Contact.find({});
  return contacts.map((contact) => contact.toJSON());
};

module.exports = { initialContacts, nonExistingID, usersInDB, contactsInDB };
