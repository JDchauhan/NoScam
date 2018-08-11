'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Disputes = new Schema({
  isPresent: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
  },
  description: {
    type: String,
  },
  file: {
    type: String,
  },
  isSolved: {
    type: Boolean,
    default: false,
  },
  solver: {
    type: String,
  },
  refund: {
    type: Number,
  },
  secondaryRelease: {
    type: Number,
  },
  serviceCharge: {
    type: Number,
  },
  faulty: {
    type: String,
  },
  creationTimestamp: {
    type: Date,
  },
  solvedTimestamp: {
    type: Date,
  }
});

var InvoiceSchema = new Schema({
  isOrderPlaced: {
    type: Boolean,
    default: false
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product'
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  isAccepted: {
    type: Boolean,
    default: false,
  },
  price: {
    type: Number,
    required: [true, 'please enter a price']
  },
  quantity: {
    type: Number,
    default: 1,
    required: [true, 'please enter a quantity']
  },
  dispute: Disputes,
  generation_timestamp: {
    type: Date,
    default: Date.now
  },
  acceptance_timestamp: {
    type: Date,
  },
  amountReleased: {
    type: Number,
  }
});

module.exports = mongoose.model('invoice', InvoiceSchema, 'invoice');