const express = require("express");
const passport = require("passport");
const customErrors = require("../../lib/custom_errors");
const UserRecipeReview = require("../models/userRecipeReview");
const handle404 = customErrors.handle404;
const requireOwnership = customErrors.requireOwnership;
const requireRole = customErrors.requireRole;
const requireToken = passport.authenticate("bearer", { session: false });
const router = express.Router();

// GET /reviews
// Get all reviews
router.get("/reviews", (req, res, next) => {
  UserRecipeReview.find()
    .then(handle404)
    .then((reviews) => reviews.map((review) => review.toObject()))
    .then((reviews) => res.json({ reviews }))
    .catch(next);
});

// Get /:id/reviews
// Get all reviews for a user
router.get("/:id/reviews", (req, res, next) => {
  const userId = req.params.id;
  UserRecipeReview.find({ owner: userId })
    .then(handle404)
    .then((reviews) => reviews.map((review) => review.toObject()))
    .then((reviews) => res.json({ reviews }))
    .catch(next);
});

// Get recipes/:id/reviews
// Get all reviews for recipe
router.get("/recipes/:id/reviews", (req, res, next) => {
  const recipeId = req.params.id;
  console.log("recipeId", recipeId);
  UserRecipeReview.find({ recipe: recipeId })
    .then(handle404)
    .then((reviews) => reviews.map((review) => review.toObject()))
    .then((reviews) => res.json({ reviews }))
    .catch(next);
});

// POST /
// Create a review
router.post("/reviews", requireToken, (req, res, next) => {
  requireRole(req.user, "critic");
  const payload = { ...req.body, owner: req.user._id };
  UserRecipeReview.create(payload)
    .then((review) => review.toObject())
    .then((review) => res.status(201).json({ review }))
    .catch(next);
});

// DELETE /reviews/:id
// delete a review
// requireOwnership
router.delete("/reviews/:id", requireToken, (req, res, next) => {
  requireRole(req.user, "critic");
  const reviewId = req.params.id;
  UserRecipeReview.findById(reviewId)
    .then(handle404)
    .then((review) => {
      requireOwnership(req, review);
      review.delete(reviewId);
    })
    .then(res.sendStatus(204))
    .catch(next);
});

module.exports = router;
