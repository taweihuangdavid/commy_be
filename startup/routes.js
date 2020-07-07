const express = require("express");
const genres = require("../routes/genres");
const customers = require("../routes/customers");
const comics = require("../routes/comics");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const auth = require("../routes/auth");
const returns = require("../routes/returns");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Origin",
      "https://fast-retreat-54128.herokuapp.com/comics"
    ); // update to match the domain you will make the request from
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
  app.use("/api/genres", genres);
  app.use("/api/customers", customers);
  app.use("/api/comics", comics);
  app.use("/api/rentals", rentals);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/returns", returns);
  app.use(error);
};
