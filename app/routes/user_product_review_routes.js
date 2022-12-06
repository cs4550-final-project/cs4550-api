const express = require("express");
const passport = require("passport");
const Product = require("../models/product");
const Store = require("../models/store");
const UserProductReview = require("../models/userProductReview");
const customErrors = require("../../lib/custom_errors");
const userProductReview = require("../models/userProductReview");
const handle404 = customErrors.handle404;
const requireOwnership = customErrors.requireOwnership;
const requireToken = passport.authenticate("bearer", { session: false });
const router = express.Router();

// GET /products/:id/reviews
// Get all reviews for a product
router.get("/products/:productId/reviews", (req, res, next) => {
  const productId = req.params.productId;
  UserProductReview.find({ product: productId })
    .then(handle404)
    .then((reviews) => reviews.map((review) => review.toObject()))
    .then((reviews) => res.json({ reviews }))
    .catch(next);
});

// POST /
// Create a review
router.post("/products/:productId/reviews", requireToken, (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId).then((product) => {
    Store.findById(product.store.toString()).then((store) => {
      if (store.owner !== req.user._id) {
        const newReview = {
          ...req.body,
          owner: req.user._id,
          product: product._id,
        };
        UserProductReview.create(newReview)
          .then((review) => review.toObject())
          .then((review) => res.status(201).json({ review }))
          .catch(next);
      }
    });
  });
});

// DELETE /reviews/:id
// delete a review
// requireOwnership
router.delete(
  "/products/:productId/reviews/:id",
  requireToken,
  (req, res, next) => {
    const productId = req.params.productId;
    const reviewId = req.params.id;
    Product.findById(productId)
      .then(handle404)
      .then((product) => {
        UserProductReview.findById(reviewId)
          .then(handle404)
          .then((review) => {
            requireOwnership(req, review);
            review.delete(reviewId);
          })
          .then(res.sendStatus(204))
          .catch(next);
      });
  }
);

module.exports = router;
