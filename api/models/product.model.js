// models/product.model.js
// Schema for the Product to be stored

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const ProductSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^https:\/\/www\.amazon\.ca\/.+\/dp\/\w{10}$/g,
      'is not a valid url'
    ]
  },
  name: {
    type: String,
    required: true
  },
  currentPrice: {
    type: Number,
    required: true
  },
  priceChange: Number,
  onSale: Boolean
});

// Make sure each URL is unique
ProductSchema.plugin(uniqueValidator, {
  message: 'is already in the database'
});

const Product = mongoose.model('Product', ProductSchema, 'all_products');

module.exports = Product;
