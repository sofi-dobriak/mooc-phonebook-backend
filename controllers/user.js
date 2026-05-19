const bcrypt = require("bcrypt");
const userRoute = require("express").Router();
const User = require("../models/user");

userRoute.get("/", async (req, res) => {
  const users = await User.find({}).populate("contacts", {
    name: 1,
    number: 1,
  });
  res.json(users);
});

userRoute.post("/", async (req, res) => {
  const { name, username, password } = req.body;

  const saltRounds = 10;
  const hashPassword = await bcrypt.hash(password, saltRounds);

  const user = new User({ name, username, hashPassword });

  const savedUser = await user.save();
  res.status(201).json(savedUser);
});

module.exports = userRoute;
