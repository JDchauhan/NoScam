var mongoose = require('mongoose');
var Payment = require('../models/paymentModel');
Payment = mongoose.model('payment');

var Invoice = require('../controllers/invoiceController');

var responses = require('../helper/responses');
var AuthoriseUser = require('../helper/authoriseUser');

var errors, results;

module.exports.create = function (req, res, userID, email, invoices, price, tax, serviceCharges, bill) {

    Payment.create({
        invoices: invoices,
        user: userID,
        price: price,
        tax: tax,
        serviceCharges: serviceCharges,
        bill: bill
    }, function (err, payment) {
        if (err) {
            console.log(err)
            if (err.name && err.name == "ValidationError") {
                errors = {
                    "index": Object.keys(err.errors)
                };
                return responses.errorMsg(res, 400, "Bad Request", "validation failed.", errors);

            } else if (err.name && err.name == "CastError") {
                errors = {
                    "index": err.path
                };
                return responses.errorMsg(res, 400, "Bad Request", "cast error.", errors);

            } else {
                console.log(err);
                return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
            }
        }
        Invoice.finalizeCheckout(req, res, bill, email);
    });
};