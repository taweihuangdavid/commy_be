const winston = require("winston");
require("winston-mongodb"); //should disable this while testing, not sure why
require("express-async-errors");

module.exports = function () {
  winston.handleExceptions(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
  ); //catch startup errors or exceptions

  process.on("unhandledRejection", (ex) => {
    throw ex;
  }); //catch startup async errors or exceptions

  winston.add(winston.transports.File, { filename: "logfile.log" });
  winston.add(winston.transports.MongoDB, {
    db: "mongodb://localhost/commy",
    level: "info",
  }); //should disable this while testing, not sure why
};
