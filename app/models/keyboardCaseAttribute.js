const mongoose = require("mongoose");

const keyboardCaseAttributeSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true,
    },
    specs: {
      lightingType: {
        type: String,
        required: true,
      },
      isWireless: {
        type: Boolean,
        required: true,
        default: false,
      },
      wireLength: {
        type: Number,
        default: 0,
      },
    },
    features: {
      hasNumericKeypad: {
        type: Boolean,
        required: true,
        default: false,
      },
      hasTouchpad: {
        type: Boolean,
        required: true,
        default: false,
      },
      hasPalmRest: {
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

module.exports = mongoose.model("KeyboardCase", keyboardCaseAttributeSchema);
