const express = require("express");
const passport = require("passport");
const User = require("../models/user");
const Product = require("../models/product");
const customErrors = require("../../lib/custom_errors");
const handle404 = customErrors.handle404;
const requireOwnership = customErrors.requireOwnership;
const requireToken = passport.authenticate("bearer", { session: false });
const router = express.Router();

// GET /products/:id/reviews
// Get all reviews for a product
router.get("/products/:productId/reviews", (req, res, next) => {});

// POST /
// Create a review
router.post(
  "/products/:productId/reviews",
  requireToken,
  (req, res, next) => {}
);

// DELETE /reviews/:id
// delete a review
// requireOwnership
router.post(
  "/products/:productId/reviews/:id",
  requireToken,
  (req, res, next) => {}
);

module.exports = router;
