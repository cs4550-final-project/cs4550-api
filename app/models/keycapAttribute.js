const mongoose = require("mongoose");

const keycapAttribute = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true,
    },
    features: {
      keycapRemovalToolIncluded: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("KeycapAttribute", keycapAttribute);
