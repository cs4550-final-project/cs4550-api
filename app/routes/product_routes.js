const express = require("express");
const passport = require("passport");
const Product = require("../models/product");
const User = require("../models/user");

const customErrors = require("../../lib/custom_errors");
const store = require("../models/store");
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
    .then((product) => product.toObject())
    .then((product) => res.json({ product }))
    .catch(next);
});

// POST /products
// Create a product
router.post("/products", requireToken, (req, res, next) => {
  Product.create(req.body)
    .then((product) => product.toObject())
    .then((product) => res.status(201).json({ product }))
    .catch(next);
});

// PATCH /products/:id
// Update product
// send current userId in params and check if product's store's owner is the same
router.patch("/products/:id", requireToken, (req, res, next) => {
  //   const productId = req.params.id;
  //   Product.findById(productId).then((product) => {
  //     const store = store.findById(product.storeId);
  //     requireOwnership(req, store);
  //   });
});

// DELETE /products/:id
// Delete product by Id
router.delete("/products/:id", requireToken, (req, res, next) => {
  const productId = req.params.id;
  Product.findOneAndDelete(productId)
    .then(handle404)
    .then(res.sendStatus(204))
    .catch(next);
});

// PATCH /products/:id/favorite
// adds a product to current user's favorite
router.patch("/products/:id/favorite", requireToken, (req, res, next) => {
  const productId = req.params.id;
  console.log(productId, req.body);
  Product.findByIdAndUpdate(
    productId,
    { $push: { usersFavorited: productId } },
    { new: true, useFindAndModify: false }
  )
    .then(handle404)
    .then(() => {
      return User.findByIdAndUpdate(req.body.userId, {
        $push: { favorites: productId },
      });
    })
    .then(() => res.sendStatus(204))
    .catch(next);
});

module.exports = router;
