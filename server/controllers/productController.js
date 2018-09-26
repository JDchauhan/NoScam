var mongoose = require('mongoose');
var Product = require('../models/productModel');
Product = mongoose.model('product');

var responses = require('../helper/responses');
var AuthoriseUser = require('../helper/authoriseUser');

var errors, results;
var perPage = 5;

module.exports.addProduct = function (req, res) {
    AuthoriseUser.getUser(req, res, function (user) {
        if (user.role !== "seller") {
            return responses.errorMsg(res, 401, "Unauthorized", "user is not a seller.", null);
        }

        Product.create({
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

module.exports.updateProduct = function (req, res) {
    AuthoriseUser.getUser(req, res, function (user) {
        if (user.role !== "seller") {
            return responses.errorMsg(res, 401, "Unauthorized", "user is not a seller.", null);
        }

        Product.findOneAndUpdate({
            _id: req.body.productID,
            seller: user.id
        }, {
            seller: user.id,
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            cc: req.body.cc,
            image: req.body.image
        }, function (err, products) {
            if (err) {
                console.log(err);
                return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
            }

            if (!products) {
                return responses.errorMsg(res, 404, "Not Found", "product not found.", null);
            }

            return responses.successMsg(res, null);
        });
    });
};

module.exports.getProducts = function (req, res) {
    let page = req.params.page || 1;

    AuthoriseUser.getUser(req, res, function (user) {
        Product.aggregate([{
                $match: {}
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
                    total: 0,
                    totalPages: 0,
                    currentPage: req.params.page,
                    currentPageRecords: 0,
                    isNext: null
                };
                return responses.successMsg(res, results);
            }

            Product.find({})
                .skip((perPage * page) - perPage)
                .limit(perPage)
                .exec(function (err, products) {
                    if (err) {
                        console.log(err);
                        return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
                    }

                    var results = {
                        products: products,
                        total: count[0].count,
                        totalPages: Math.ceil(count[0].count / perPage),
                        currentPage: req.params.page,
                        currentPageRecords: products.length,
                        isNext: null
                    };

                    if (results.totalPages - req.params.page > 0) {
                        results.isNext = true;
                    }
                    return responses.successMsg(res, results);
                });
        });
    });
};

module.exports.deleteProduct = function (req, res) {
    AuthoriseUser.getUser(req, res, function (user) {
        if (user.role !== "seller") {
            return responses.errorMsg(res, 401, "Unauthorized", "user is not a seller.", null);
        }

        Product.findOneAndRemove({
            _id: req.body.productID,
            seller: user.id
        }, function (err, products) {
            if (err) {
                console.log(err);
                return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
            }

            if (!products) {
                return responses.errorMsg(res, 404, "Not Found", "product not found.", null);
            }

            return responses.successMsg(res, null);
        });
    });
};

module.exports.getProductsBySeller = function (req, res) {
    let page = req.params.page || 1;

    AuthoriseUser.getUser(req, res, function (user) {
        Product.find({
                seller: req.params.sellerId
            }).skip((perPage * page) - perPage)
            .limit(perPage)
            .exec(function (err, products) {
                if (err) {
                    console.log(err);
                    return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
                }

                results = {
                    products: products
                };
                return responses.successMsg(res, results);
            });
    });
};