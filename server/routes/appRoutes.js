'use strict';
module.exports = function (app) {
    var VerifyToken = require('../helper/verifyToken');
    var responses = require('../helper/responses');

    var User = require('../controllers/userController');
    var Product = require('../controllers/productController');
    var Invoice = require('../controllers/invoiceController');
    
    var errors, results;

    // Routes
    app.get("/", function (req, res) {
        results = {
            "message": "you have successfully reached the api"
        };
        return responses.successMsg(res, results);
    });

    //user
    app.post('/login', User.login);

    app.get('/verify/email/:token', VerifyToken, User.verify);

    app.post('/verify/email', User.sendVerificationLink);

    app.post('/user', User.register);

    app.get('/user', VerifyToken, User.current_user);


    //product
    app.get('/products', VerifyToken, Product.getProducts);
    
    app.post('/products', VerifyToken, Product.addProduct);

    app.put('/products', VerifyToken, Product.updateProduct);

    app.delete('/products', VerifyToken, Product.deleteProduct);

    app.get('/products/seller/:sellerId', VerifyToken, Product.getProductsBySeller);

    //Cart
    app.get('/cart', VerifyToken, Invoice.getCart);

    app.post('/cart', VerifyToken, Invoice.createInvoice);

    // star routes
    app.get('*', function (req, res) {
        return responses.errorMsg(res, 404, "Not Found", "path not found.", null);
    });

    app.put('*', function (req, res) {
        return responses.errorMsg(res, 404, "Not Found", "path not found.", null);
    });

    app.delete('*', function (req, res) {
        return responses.errorMsg(res, 404, "Not Found", "path not found.", null);
    });

    app.post('*', function (req, res) {
        return responses.errorMsg(res, 404, "Not Found", "path not found.", null);
    });

};