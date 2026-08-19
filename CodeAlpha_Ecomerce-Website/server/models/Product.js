const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    category: { type: String },
    stock: { type: Number, default: 10 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
