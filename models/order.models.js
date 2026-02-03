const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        title: {
          type: String,
          required: true,
        },
        author: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        category: {
          type: String,
          required: true,
        },
        publicationHouse: {
          type: String,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    numberOfItems: {
      type: Number,
      required: true,
    },
    deliveryAddress: {
      title: {
        type: String,
        required: true,
      },
      location: {
        type: String,
        required: true,
      },
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
