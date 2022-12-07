const express = require("express");
const passport = require("passport");
const Product = require("../models/product");
const User = require("../models/user");
const Store = require("../models/store");

const customErrors = require("../../lib/custom_errors");
const handle404 = customErrors.handle404;
const requireOwnership = customErrors.requireOwnership;
const requireToken = passport.authenticate("bearer", { session: false });
const router = express.Router();

// GET /products
// Get all products
router.get("/products", (req, res, next) => {
  Product.find()
    .then((products) => products.map((p) => p.toObject()))
    .then((products) => res.json({ products }))
    .catch(next);
});

// GET /products/:id
// Get product by id
router.get("/products/:id", (req, res, next) => {
  const productId = req.params.id;
  Product.findById(productId)
    .populate("store")
    .then(handle404)
    .then((product) => product.toObject())
    .then((product) => res.json({ product }))
    .catch(next);
});

// POST /products
// Create a product
router.post("/products", requireToken, (req, res, next) => {
  Store.findById(req.body.store)
    .then(handle404)
    .then((store) => requireOwnership(req, store.toObject()))
    .then(() => {
      Product.create(req.body)
        .then((product) => product.toObject())
        .then((product) => res.status(201).json({ product }))
        .catch(next);
    })
    .catch(next);
});

// PATCH /products/:id
// Update product
// send current userId in params and check if product's store's owner is the same
router.patch("/products/:id", requireToken, (req, res, next) => {
  const productId = req.params.id;
  Product.findById(productId)
    .then((product) => {
      Store.findById(product.store.toString())
        .then((store) => requireOwnership(req, store))
        .then(() => product.update(req.body))
        .catch(next);
    })
    .then(() => res.sendStatus(204))
    .catch(next);
});

// DELETE /products/:id
// Delete product by Id
router.delete("/products/:id", requireToken, (req, res, next) => {
  const productId = req.params.id;
  Product.findById(productId)
    .then(handle404)
    .then((product) => {
      Store.findById(product.store.toString())
        .then((store) => requireOwnership(req, store))
        .then(() => product.delete(productId))
        .catch(next);
    })
    .then(res.sendStatus(204))
    .catch(next);
});

// PATCH /products/:id/favorite
// adds a product to current user's favorite
router.patch("/products/:id/favorite", requireToken, (req, res, next) => {
  const productId = req.params.id;
  Product.findByIdAndUpdate(productId, {
    $addToSet: { usersFavorited: req.user._id },
  })
    .then(() => {
      return User.findByIdAndUpdate(req.user._id, {
        $addToSet: { favorites: productId },
      });
    })
    .then(() => res.sendStatus(204))
    .catch(next);
});

module.exports = router;
