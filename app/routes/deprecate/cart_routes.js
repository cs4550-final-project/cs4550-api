const express = require("express");
const passport = require("passport");
const Cart = require("../../models/deprecate/cart");
const Product = require("../models/product");
const customErrors = require("../../../lib/custom_errors");
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
router.get("/cart", requireToken, (req, res, next) => {
  Cart.findOne({ owner: req.user._id })
    .then(handle404)
    .then((cart) => cart.toObject())
    .then((cart) => res.json({ cart }))
    .catch(next);
});

// POST /cart
// Create a cart
router.post("/carts", (req, res, next) => {
  Cart.create(req.body)
    .then((cart) => cart.toObject())
    .then((cart) => res.status(201).json({ cart }))
    .catch(next);
});

// DELETE /cart
// Delete a cart
router.delete("/carts", requireToken, (req, res, next) => {
  Cart.find({ owner: req.user._id })
    .then(handle404)
    .then((cart) => cart.delete(cart._id))
    .then(() => res.sendStatus(204))
    .catch(next);
});

module.exports = router;
