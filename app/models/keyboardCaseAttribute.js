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
      formFactor: {
        type: Number,
        required: true,
      },
      isWireless: {
        type: Boolean,
        required: true,
      },
    },
    features: {
      hasNumericKeypad: {
        type: Boolean,
        required: true,
      },
      hasTouchpad: {
        type: Boolean,
        required: true,
      },
      hasPalmRest: {
        type: Boolean,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("KeyboardCase", keyboardCaseAttributeSchema);
