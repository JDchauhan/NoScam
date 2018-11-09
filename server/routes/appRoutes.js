'use strict';
module.exports = function (app) {
    let serverPath = '';
    serverPath = '/noscam/:8000';    

    var VerifyToken = require('../helper/verifyToken');
    var responses = require('../helper/responses');

    var User = require('../controllers/userController');
    var Product = require('../controllers/productController');
    var Invoice = require('../controllers/invoiceController');
    var transactionController = require('../controllers/transactionController');
    var errors, results;

    // Routes
    app.get(serverPath + "/", function (req, res) {
        results = {
            "message": "you have successfully reached the api"
        };
        return responses.successMsg(res, results);
    });

    //user
    app.post(serverPath + '/login', User.login);

    app.get(serverPath + '/verify/email/:token', VerifyToken, User.verify);

    app.post(serverPath + '/verify/email', User.sendVerificationLink);

    app.post(serverPath + '/user', User.register);

    app.put(serverPath + '/user',VerifyToken , User.update);

    app.get(serverPath + '/user', VerifyToken, User.current_user);


    //product
    app.get(serverPath + '/products/:page', VerifyToken, Product.getProducts);
    
    app.post(serverPath + '/products', VerifyToken, Product.addProduct);

    app.put(serverPath + '/products', VerifyToken, Product.updateProduct);

    app.delete(serverPath + '/products', VerifyToken, Product.deleteProduct);

    app.get(serverPath + '/products/:page/seller/:sellerId', VerifyToken, Product.getProductsBySeller);

    //Cart
    app.get(serverPath + '/cart', VerifyToken, Invoice.getCart);

    app.put(serverPath + '/cart', VerifyToken, Invoice.updateCart);

    app.post(serverPath + '/cart', VerifyToken, Invoice.createInvoice);
    
    app.delete(serverPath + '/cart', VerifyToken, Invoice.deleteInvoice);

    app.put(serverPath + '/cart/checkout', VerifyToken, Invoice.checkout);

    app.put(serverPath + '/orders/status', VerifyToken, Invoice.updateOrderStatus);

    app.get(serverPath + '/orders/:page', VerifyToken, Invoice.getOrders);


    //transactions
    app.post(serverPath + '/payment/payumoney',transactionController.payUMoneyPayment);

    app.post(serverPath + '/payment/paytm', VerifyToken, transactionController.paytmPayment);

    app.post(serverPath + '/payment/stripe',transactionController.stripePayment);

    app.post(serverPath + '/payment/payumoney/response', transactionController.payUMoneyPaymentResponse);

    app.post(serverPath + '/payment/paytm/response', transactionController.paytmPaymentResponse);
    
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