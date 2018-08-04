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
    type: mongoose.Schema.Types.Double,
  },
  secondaryRelease: {
    type: mongoose.Schema.Types.Double,
  },
  serviceCharge: {
    type: mongoose.Schema.Types.Double,
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
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
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
    type: mongoose.Schema.Types.Double,
    required: [true, 'please enter a price']
  },
  quantity: {
    type: Number,
    default: 1
  },
  cc: {
    type: Number,
  },
  dispute: Disputes,
  cc: {
    type: Number,
  },
  generation_timestamp: {
    type: Date,
    default: Date.now
  },
  acceptance_timestamp: {
    type: Date,
  },
  amountReleased:{
    type: mongoose.Schema.Types.Double,
  }
});

module.exports = mongoose.model('invoice', InvoiceSchema, 'invoice');