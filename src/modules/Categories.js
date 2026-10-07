const mongoose = require("mongoose");

const CategoriesSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  numOfProducts: {
    type: Number,
    default: 0,
    required: true,
    min: 0,
  },
});

module.exports = mongoose.model("categories", CategoriesSchema);
