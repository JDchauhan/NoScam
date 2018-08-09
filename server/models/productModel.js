'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product'
  }],
  name: {
    type: String,
    required: [true, 'please enter a name']
  },
  price: {
    type: Number,
    required: [true, 'please enter a price']
  },
  description: {
    type: String
  },
  image: {
    type: String,
  },
  youtube: String,
  cc: {
    type: Number,
  },
  generation_timestamp: {
    type: Date,
    default: Date.now
  },
  isVisible: {
    type: Boolean,
    default: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, "must need an seller"]
  },
  isPackage: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('product', productSchema, 'product');