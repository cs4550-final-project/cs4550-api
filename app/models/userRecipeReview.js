const mongoose = require("mongoose");

const userRecipeReviewSchema = new mongoose.Schema(
  {
    recipe: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      required: true,
    },
    review: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("UserRecipeReview", userRecipeReviewSchema);
