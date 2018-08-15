'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PaymentSchema = new Schema({
  invoices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'invoice'
  }],
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  price: {
    type: Number,
    required: [true, 'please enter a price']
  },
  tax: {
    type: Number,
    required: [true, 'please enter a price']
  },
  serviceCharges: {
    type: Number,
    required: [true, 'please enter a price']
  },
  bill: {
    type: Number,
    required: [true, 'please enter a price']
  },
  generation_timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('payment', PaymentSchema, 'payment');