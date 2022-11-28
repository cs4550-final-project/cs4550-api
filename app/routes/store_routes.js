const express = require("express");
const passport = require("passport");
const Store = require("../models/store");
const customErrors = require("../../lib/custom_errors");
const handle404 = customErrors.handle404;
const requireOwnership = customErrors.requireOwnership;
const requireToken = passport.authenticate("bearer", { session: false });
const router = express.Router();

// GET /store
// Get current user's store
router.get("/store", (req, res, next) => {
  Store.findOne({ ownerId: req.body.ownerId })
    .then((store) => store.toObject())
    .then((store) => res.json({ store }))
    .catch(next);
});

// POST /create-store
// Create a store
router.post("/store", requireToken, (req, res, next) => {
  Store.create(req.body)
    .then((store) => store.toObject())
    .then((store) => res.status(201).json({ store }))
    .catch(next);
});

// PATCH /update-store
// Update store
router.patch("/store", requireToken, (req, res, next) => {
  Store.findOne({ ownerId: req.body.ownerId })
    .then(handle404)
    .then((store) => {
      requireOwnership(req, store);
      store.name = req.body.name ? req.body.name : store.name;
      store.description = req.body.description
        ? req.body.description
        : store.description;
      store.status = req.body.status ? req.body.status : store.status;
      return store.save();
    })
    .then((store) => res.status(204).json({ store }))
    .catch(next);
});

module.exports = router;
