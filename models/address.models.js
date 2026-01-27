const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true },
);

const Address = mongoose.model("Address", addressSchema);
module.exports = Address;
