var mongoose = require('mongoose');
var Product = require('../models/productModel');
Product = mongoose.model('product');

var Invoice = require('../models/invoiceModel');
Invoice = mongoose.model('invoice');

var User = require('../controllers/userController');

var responses = require('../helper/responses');
var AuthoriseUser = require('../helper/authoriseUser');

var errors, results;

var perPage = 5;

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

module.exports.checkout = function (req, res) {
    AuthoriseUser.getUser(req, res, function (user) {
        if (user.role !== "buyer") {
            return responses.errorMsg(res, 401, "Unauthorized", "user is not a buyer.", null);
        }

        Invoice.aggregate([{
                $match: {
                    isOrderPlaced: false
                }
            },
            {
                $group: {
                    _id: '$isOrderPlaced',
                    amount: {
                        $sum: "$price"
                    }
                }
            }
        ], function (err, checkout) {
            if (checkout.length === 0) {
                return responses.errorMsg(res, 404, "Not Found", "no item in cart.", null);
            }

            let tax = Math.round(checkout[0].amount * 100 * (5 / 100)) / 100;
            let charge = Math.round(checkout[0].amount * 100 * (5 / 100)) / 100;

            let totalBill = Math.round((checkout[0].amount + tax + charge) * 100) / 100;
            if (user.balance < totalBill) {
                return responses.errorMsg(res, 406, "Not Acceptable", "insufficient balance.", null);
            } else {
                let remainBalnce = Math.round((user.balance - totalBill) * 100) / 100;
                User.deduct(req, res, user._id, req.body.invoices, remainBalnce, checkout[0].amount, tax, charge, totalBill);
            }
        });
    });
};

module.exports.finalizeCheckout = function (req, res) {
    Invoice.updateMany({
        isOrderPlaced: false
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
};

module.exports.getOrders = function (req, res) {
    let page = req.params.page || 1;
    AuthoriseUser.getUser(req, res, function (user) {
        let query;
        if (user.role === "seller") {
            query = {
                seller: user._id,
                isOrderPlaced: true,
                isOrderComplete: false,
            };
        } else {
            query = {
                buyer: user._id,
                isOrderPlaced: true,
                isOrderComplete: false,
            };
        }
        Invoice.aggregate([{
                $match: query
            },
            {
                $group: {
                    _id: 'count',
                    count: {
                        $sum: 1
                    }
                }
            }
        ], function (err, count) {
            if (!count[0]) {
                var results = {
                    users: [],
                    totalUsers: 0,
                    totalPages: 0,
                    currentPage: req.params.page,
                    currentPageRecords: 0
                };
                return responses.successMsg(res, results);
            }


            Invoice.find(query)
                .populate("product", "-__v")
                .skip((perPage * page) - perPage)
                .limit(perPage)
                .exec(function (err, invoices) {
                    if (err) {
                        console.log(err);
                        return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
                    }

                    var results = {
                        invoices: invoices,
                        total: count[0].count,
                        totalPages: Math.ceil(count[0].count / perPage),
                        currentPage: req.params.page,
                        currentPageRecords: invoices.length,
                        isNext: null
                    };

                    if(results.totalPages - req.params.page > 0){
                        results.isNext = true;
                    }
                        
                    return responses.successMsg(res, results);
                });
        });
    });
};