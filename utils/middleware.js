const logger = require("./logger");

const errorHandler = (err, req, res, next) => {
  logger.error(err.message);

  if (err.name === "ValidationError") {
    return res.status(400).json({ error: `validation error: ${err.message}` });
  }

  if (err.name === "DocumentNotFoundError") {
    return res.status(404).json({ error: "not found" });
  }

  if (err.name === "MongoServerError" && err.code === 11000) {
    return res.status(400).json({ error: "name must be unqie" });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ error: "wrong id format" });
  }

  next(err);
};

const unknownEndpoint = (req, res) => {
  return res.status(404).send("Unknown endpoint");
};

module.exports = { errorHandler, unknownEndpoint };
