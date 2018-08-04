'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Rating = new Schema({
  TotalCount: {
    type: Number,
    default: 0,
  },
  five: {
    type: Number,
    default: 0,
  },
  four: {
    type: Number,
    default: 0,
  },
  three: {
    type: Number,
    default: 0,
  },
  two: {
    type: Number,
    default: 0,
  },
  one: {
    type: Number,
    default: 0,
  },
  zero: {
    type: Number,
    default: 0,
  }
});

var Disputes = new Schema({
  TotalCount: {
    type: Number,
    default: 0,
  },
  solved: {
    type: Number,
    default: 0,
  },
  selfSolved: {
    type: Number,
    default: 0,
  }
});

var UserSchema = new Schema({
  fname: {
    type: String,
    lowercase: true,
    minlength: [3, 'name is atleast of 3 characters'],
    maxlength: [30, 'name does not exceeds 30 characters'],
    required: [true, 'please enter your name']
  },
  mname: {
    type: String,
    lowercase: true,
  },
  lname: {
    type: String,
    lowercase: true,
    minlength: [3, 'name is atleast of 3 characters'],
    maxlength: [30, 'name does not exceeds 30 characters']
  },
  email: {
    type: String,
    lowercase: true,
    minlength: [3, 'email is atleast of 3 characters'],
    maxlength: [30, 'email does not exceeds 30 characters'],
    match: /\S+@\S+\.\S+/,
    required: [true, 'please enter your email']
  },
  isVerifiedEmail: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
  },
  mobile: {
    type: Number,
    min: [6999999999, 'not a valid mobile number'],
    max: [9999999999, 'not a valid mobile number'],
    required: [true, 'please enter your mobile number']
  },
  isVerifiedMobile: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['buyer', 'seller']
  },
  balance: {
    type: mongoose.Schema.Types.Double,
    default: 0.0
  },
  maxOrderSize: {
    type: Number,
    default: 0
  },
  rating: Rating,
  connectivity: Rating,
  relevancy: Rating,
  disputesSolved: Disputes,
  active: {
    type: Boolean,
    default: true
  },
  registration_timestamp: {
    type: Date,
    default: Date.now
  },
  last_login_timestamp: {
    type: Date
  },
  activation_timestamp: {
    type: Date
  },
  deactivation_timestamp: {
    type: Date
  }
});

module.exports = mongoose.model('user', UserSchema, 'users');