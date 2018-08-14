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

        Product.findById(req.body.productID, function (err, product) {
            if (err) {
                console.log(err);
                return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
            }

            if (!product) {
                return responses.errorMsg(res, 404, "Not Found", "product not found.", null);
            }

            Invoice.create({
                seller: product.seller,
                product: product._id,
                buyer: user.id,
                quantity: req.body.quantity,
                price: (req.body.quantity * product.price)
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
    });
};

module.exports.getCart = function (req, res) {
    AuthoriseUser.getUser(req, res, function (user) {
        if (user.role !== "buyer") {
            return responses.errorMsg(res, 401, "Unauthorized", "user is not a buyer.", null);
        }

        Invoice.find({
                buyer: user._id,
                isOrderPlaced: false
            })
            .populate("product", "-__v").exec(function (err, invoices) {
                if (err) {
                    console.log(err);
                    return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
                }

                if (!invoices) {
                    return responses.errorMsg(res, 404, "Not Found", "nothing in cart.", null);
                }

                let bill = 0;
                invoices.forEach(invoice => {
                    bill += invoice.price;
                });
                results = {
                    invoices: invoices,
                    total: bill
                };
                return responses.successMsg(res, results);
            });
    });
};

module.exports.updateCart = function (req, res) {
    AuthoriseUser.getUser(req, res, function (user) {
        if (user.role !== "buyer") {
            return responses.errorMsg(res, 401, "Unauthorized", "user is not a buyer.", null);
        }

        Product.findById(req.body.productID, function (err, product) {
            if (err) {
                console.log(err);
                return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
            }

            if (!product) {
                return responses.errorMsg(res, 404, "Not Found", "product not found.", null);
            }

            Invoice.findOneAndUpdate({
                _id: req.body.invoiceID,
                buyer: user.id
            }, {
                quantity: req.body.quantity,
                price: product.price * req.body.quantity
            }, function (err, invoice) {
                if (err) {
                    console.log(err);
                    return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
                }

                if (!invoice) {
                    return responses.errorMsg(res, 404, "Not Found", "order not found.", null);
                }

                return responses.successMsg(res, null);
            });
        });
    });
};

module.exports.deleteInvoice = function (req, res) {
    AuthoriseUser.getUser(req, res, function (user) {
        if (user.role !== "buyer") {
            return responses.errorMsg(res, 401, "Unauthorized", "user is not a buyer.", null);
        }

        Invoice.findByIdAndRemove(req.body.invoiceID, function (err, invoices) {
            if (err) {
                console.log(err);
                return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
            }

            if (!invoices) {
                return responses.errorMsg(res, 404, "Not Found", "invoice not found.", null);
            }

            return responses.successMsg(res, null);
        });
    });
};

module.exports.purchase = function (req, res) {
    AuthoriseUser.getUser(req, res, function (user) {
        if (user.role !== "buyer") {
            return responses.errorMsg(res, 401, "Unauthorized", "user is not a buyer.", null);
        }

        Invoice.updateMany({
            _id: {
                $in: req.body.invoices
            }
        }, {
            isOrderPlaced: true
        }, function (err, invoice) {
            if (err) {
                console.log(err);
                return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
            }

            if (!invoice) {
                return responses.errorMsg(res, 404, "Not Found", "order not found.", null);
            }

            return responses.successMsg(res, null);
        });
    });
};
