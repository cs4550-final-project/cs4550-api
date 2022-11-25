const mongoose = require("mongoose");

const switchAttributeSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true,
    },
    switchType: {
      type: String,
      required: true,
    },
    packSize: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SwitchAttribute", switchAttributeSchema);
