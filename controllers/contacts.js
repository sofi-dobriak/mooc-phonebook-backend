const contactsRoute = require("express").Router();
const Contact = require("../models/contact");
const User = require("../models/user");

contactsRoute.get("/", async (req, res) => {
  const contacts = await Contact.find({}).populate("user", {
    name: 1,
    username: 1,
  });
  res.json(contacts);
});

contactsRoute.get("/:id", async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  contact ? res.json(contact) : res.status(404).end();
});

contactsRoute.post("/", async (req, res) => {
  const body = req.body;

  const user = await User.findById(body.userId);

  if (!user) {
    return res.status(400).json({ error: "userId is missing or not valid" });
  }

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "Name or number is missing",
    });
  }

  const contact = new Contact({
    name: body.name,
    number: body.number,
    user: user._id,
  });

  const savedContact = await contact.save();

  user.contacts = user.contacts.concat(savedContact._id);
  await user.save();

  res.status(201).json(savedContact);
});

contactsRoute.put("/:id", async (req, res) => {
  const { name, number } = req.body;

  const contact = await Contact.findById(req.params.id);
  if (!contact) return res.status(404).end();

  contact.name = name;
  contact.number = number;

  const updatedContact = await contact.save();
  res.status(200).json(updatedContact);
});

contactsRoute.delete("/:id", async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  contact ? res.status(204).end() : res.status(404).send("Contact not found");
});

module.exports = contactsRoute;
