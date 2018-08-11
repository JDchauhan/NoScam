var mongoose = require('mongoose');
var Product = require('../models/productModel');
Product = mongoose.model('product');

var Invoice = require('../models/invoiceModel');
Invoice = mongoose.model('invoice');

var responses = require('../helper/responses');
var AuthoriseUser = require('../helper/authoriseUser');

var errors, results;

module.exports.createInvoice = function (req, res) {
    AuthoriseUser.getUser(req, res, function (user) {
        if (user.role !== "buyer") {
            return responses.errorMsg(res, 401, "Unauthorized", "user is not a buyer.", null);
        }

        Invoice.create({
            seller: user.id,
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            cc: req.body.cc,
            image: req.body.image
        }, function (err, product) {
            if (err) {

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

            return responses.successMsg(res, null);
        });
    });
};