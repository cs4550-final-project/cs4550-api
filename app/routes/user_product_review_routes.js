const express = require("express");
const passport = require("passport");
const User = require("../models/user");
const Product = require("../models/product");
const UserProductReview = require("../models/userProductReview");
const customErrors = require("../../lib/custom_errors");
const user = require("../models/user");
const userProductReview = require("../models/userProductReview");
const handle404 = customErrors.handle404;
const requireOwnership = customErrors.requireOwnership;
const requireToken = passport.authenticate("bearer", { session: false });
const router = express.Router();

// GET /products/:id/reviews
// Get all reviews for a product
router.get("/products/:productId/reviews", (req, res, next) => {
  const productId = re.params.id;
  UserProductReview.findById(productId)
    .then((review) => review.toObject())
    .then((review) => res.json({ review }))
    .catch(next);
});

// POST /
// Create a review
router.post(
  "/products/:productId/reviews",
  requireToken,
  (req, res, next) => {
    const productId = req.params.id;
    Product.findById(productId)
      .then((product) => {
        Store.findById(product.storeId.toString())
          .then((store) => {
            if (store.ownerId !== req.user._id) {
              UserProductReview.create(req.body)
                  .then((review) => review.toObject())
                  .then((review) => res.status(201).json({ review }))
                  .catch(next);
            }
          })
      })
  }
);

// DELETE /reviews/:id
// delete a review
// requireOwnership
router.delete(
  "/products/:productId/reviews/:id",
  requireToken,
  (req, res, next) => {
    const productId = req.params.id;
    const reviewId = req.params.reviewId;
    Product.findById(productId)
    .then(handle404)
      .then((product) => {
        UserProductReview.findById(product.productId)
        .then(handle404)
        .then((review) => {
          if (review.userId === req.user._id) {
            review.delete(reviewId);
          }
        })
        .then(res.sendStatus(204))
        .catch(next);
      })
  }
);

module.exports = router;
