const express = require("express");
const passport = require("passport");
const Cart = require("../models/cart");
const Product = require("../models/product");
const customErrors = require("../../lib/custom_errors");
const handle404 = customErrors.handle404;
const requireOwnership = customErrors.requireOwnership;
const requireToken = passport.authenticate("bearer", { session: false });
const router = express.Router();

// GET all carts
router.get("/carts", (req, res, next) => {
  Cart.find()
    .then(handle404)
    .then((carts) => carts.map((c) => c.toObject()))
    .then((carts) => res.json({ carts }));
});

// GET /cart
// Get store information
router.get("/cart", requireToken, requireOwnership, (req, res, next) => {
  Cart.find({ ownerId: req.user._id })
    .then(handle404)
    .then((cart) => cart.toObject())
    .then((cart) => res.json({ cart }))
    .catch(next);
});

// POST /cart
// Create a cart
router.post("/cart", (req, res, next) => {
  Cart.create(req.body)
    .then((cart) => cart.toObject())
    .then((cart) => res.status(201).json({ cart }))
    .catch(next);
});

// DELETE /cart
// Delete a cart
router.delete("/cart", requireToken, (req, res, next) => {
  Cart.find({ ownerId: req.user._id })
    .then(handle404)
    .then((cart) => cart.delete(cart._id))
    .then(() => res.sendStatus(204))
    .catch(next);
});
