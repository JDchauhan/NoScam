var mongoose = require('mongoose');
var Product = require('../models/productModel');
Product = mongoose.model('product');

var responses = require('../helper/responses');
var AuthoriseUser = require('../helper/authoriseUser');

var errors, results;

module.exports.addProduct = function (req, res) {
    AuthoriseUser.getUser(req, res, function (user) {
        if (user.role !== "seller") {
            return responses.errorMsg(res, 401, "Unauthorized", "user is not a seller.", null);
        }

        req.body.seller = user.id;
        Product.create(req.body, function (err, product) {
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

module.exports.getProducts = function (req, res) {
    AuthoriseUser.getUser(req, res, function (user) {
        
        Product.find({}, function (err, products) {
            if (err) {
                console.log(err);
                return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
            }

            results = {
                products: products
            }
            return responses.successMsg(res, results);
        });
    });
};