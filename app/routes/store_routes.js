const express = require("express");
const passport = require("passport");
const Store = require("../models/store");
const Product = require("../models/product");
const customErrors = require("../../lib/custom_errors");
const handle404 = customErrors.handle404;
const requireOwnership = customErrors.requireOwnership;
const requireToken = passport.authenticate("bearer", { session: false });
const router = express.Router();

// GET all stores
router.get("/stores", (req, res, next) => {
  Store.find()
    .then(handle404)
    .then((stores) => stores.map((s) => s.toObject()))
    .then((stores) => res.json({ stores }));
});

// GET /store
// Get store information
router.get("/store/:id", (req, res, next) => {
  const storeId = req.params.id;
  Store.findById(storeId)
    .then(handle404)
    .then((store) => store.toObject())
    .then((store) => res.json({ store }))
    .catch(next);
});

// Get the store's products
router.get("/store/:id/products", (req, res, next) => {
  const storeId = req.params.id;
  Product.findById(storeId)
    .then(handle404)
    .then((products) => products.map((p) => p.toObject()))
    .then((products) => res.json({ products }));
});

// POST /store
// Create a store
router.post("/store", requireToken, (req, res, next) => {
  const payload = { ownerId: req.user._id, ...req.body };
  Store.create(payload)
    .then((store) => store.toObject())
    .then((store) => res.status(201).json({ store }))
    .catch(next);
});

// PATCH /store/:id
// Update store details
router.patch("/store/:id", requireToken, (req, res, next) => {
  const storeId = req.params.id;
  Store.findById(storeId)
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

// PATCH /store/:id
// deactivate store and all its products

module.exports = router;
