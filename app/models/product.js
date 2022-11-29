const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    productType: {
      type: String,
      enum: ["switch"],
      required: true,
    },
    dimensions: {
      height: {
        type: Number,
        required: true,
      },
      width: {
        type: Number,
        required: true,
      },
      weight: {
        type: Number,
        required: true,
      },
    },
    materials: [
      {
        type: String,
        required: true,
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      validate: {
        validator: Number.isInteger,
        message: "quantity {VALUE} is not an integer",
      },
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    upc: {
      type: String,
    },
    usersFavorited: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    attributes: {
      topHousingMaterial: {
        type: String,
      },
      bottomHousingMaterial: {
        type: String,
      },
      stemMaterial: {
        type: String,
      },
      springWeight: {
        type: Number,
      },
      prelubed: {
        type: Boolean,
      },
      switchType: {
        type: String,
        enum: ["linear", "tactile", "clicky"],
      },
      packSize: {
        type: Number,
      },
      mountingPins: {
        type: Number,
      },
      manufacturer: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
