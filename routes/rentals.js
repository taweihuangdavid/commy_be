const { Rental, validate } = require("../models/rental");
const { Comic } = require("../models/comic");
const { Customer } = require("../models/customer");
const mongoose = require("mongoose");
const Fawn = require("fawn");
const express = require("express");
const router = express.Router();

Fawn.init(mongoose);

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer.");

  const comic = await Comic.findById(req.body.comicId);
  if (!comic) return res.status(400).send("Invalid comic.");

  if (comic.numberInStock === 0)
    return res.status(400).send("Comic not in stock.");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    comic: {
      _id: comic._id,
      title: comic.title,
      dailyRentalRate: comic.dailyRentalRate,
    },
  });

  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update(
        "comics",
        { _id: comic._id },
        {
          $inc: { numberInStock: -1 },
        }
      )
      .run();

    res.send(rental);
  } catch (ex) {
    res.status(500).send("Something failed.");
  }
});

router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental)
    return res.status(404).send("The rental with the given ID was not found.");

  res.send(rental);
});

module.exports = router;
