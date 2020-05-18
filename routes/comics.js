const { Comic, validate } = require("../models/comic");
const { Genre } = require("../models/genre");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const comics = await Comic.find().sort("name");
  res.send(comics);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  const comic = new Comic({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  await comic.save();

  res.send(comic);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  const comic = await Comic.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    { new: true }
  );

  if (!comic)
    return res.status(404).send("The comic with the given ID was not found.");

  res.send(comic);
});

router.delete("/:id", async (req, res) => {
  const comic = await Comic.findByIdAndRemove(req.params.id);

  if (!comic)
    return res.status(404).send("The comic with the given ID was not found.");

  res.send(comic);
});

router.get("/:id", async (req, res) => {
  const comic = await Comic.findById(req.params.id);

  if (!comic)
    return res.status(404).send("The comic with the given ID was not found.");

  res.send(comic);
});

module.exports = router;
