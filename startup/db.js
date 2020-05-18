const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");

module.exports = function () {
  const db = config.get("db");
  mongoose
    .connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    }) //Need to add these options to successfully run mongodb, not sure why
    .then(() => winston.info(`Connected to ${db}...`));
};
