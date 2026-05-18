const infoRoute = require("express").Router();
const Contact = require("../models/contact");

infoRoute.get("/", async (req, res, next) => {
  const count = await Contact.countDocuments({});
  res.send(`Phonebook has info for ${count} people\n${new Date()}`);
});

module.exports = infoRoute;
