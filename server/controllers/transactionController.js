var mongoose = require('mongoose');
var Transaction = require('../models/transactionModel');
Transaction = mongoose.model('transaction');

var userController = require('../controllers/userController');
var config = require('../config');

var stripe = require("stripe")(config.stripeKey);
var request = require('request');
var Checksum = require('../helper/paytm/checksum');

var responses = require('../helper/responses');
var errors, results;

var jsSHA = require("jssha");
exports.payUMoneyPayment = function (req, res) {
    if (!req.body.txnid || !req.body.amount || !req.body.productinfo ||
        !req.body.firstname || !req.body.email) {
        res.send("Mandatory fields missing");
    } else {
        var pd = req.body;
        var hashString = config.merchantKey + '|' + pd.txnid + '|' +
            pd.amount + '|' + pd.productinfo + '|' + pd.firstname + '|' +
            pd.email + '|' + '||||||||||' + config.merchantSalt;

        var sha = new jsSHA('SHA-512', "TEXT");
        sha.update(hashString)
        var hash = sha.getHash("HEX");
        res.send({
            'hash': hash
        });
    }
};

exports.payUMoneyPaymentResponse = function (req, res) {
    var pd = req.body;
    //Generate new Hash 
    var hashString = config.merchantSalt + '|' + pd.status + '||||||||||' + '|' +
        pd.email + '|' + pd.firstname + '|' + pd.productinfo + '|' + pd.amount + '|' +
        pd.txnid + '|' + config.merchantKey;

    var sha = new jsSHA('SHA-512', "TEXT");
    sha.update(hashString)
    var hash = sha.getHash("HEX");
    // Verify the new hash with the hash value in response
    //pd.net_amount_debit,
    //pd.payuMoneyId,
    if (hash == pd.hash) {

        Transaction.create({
            email: pd.email,
            amount: pd.net_amount_debit,
            txnID: pd.payuMoneyId
        }, function (err, response) {
            if (err) {
                if (err.code && err.code == 11000) {} else {
                    return console.log(err);
                }
                res.send({
                    'status': "Error occured"
                });
            } else {
                userController.addMoney(req, res, pd.email, pd.net_amount_debit, function (result) {
                    if (!result) {
                        return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
                    } else {
                        return responses.successMsg(res, null);
                    }
                });
            }
        })
    } else {
        res.send({
            'status': "Error occured"
        });
    }
};

exports.stripePayment = function (req, res) {
    // Token is created using Checkout or Elements!
    // Get the payment token ID submitted by the form:
    const token = req.body.token.id; // Using Express
    const charge = stripe.charges.create({
        amount: req.body.amount,
        currency: 'inr',
        description: 'add money',
        source: token,
    }, function (err, charge) {
        if (err) {
            console.log(err);
            return res.send({
                'status': "Error occured"
            });
        }

        Transaction.create({
            email: req.body.token.email,
            amount: req.body.amount / 100,
            txnID: charge.id
        }, function (err, response) {
            if (err) {
                console.log(err);
                return res.send({
                    'status': "Error occured"
                });
            } else {
                userController.addMoney(req, res, req.body.token.email, req.body.amount / 100, function (result) {
                    if (!result) {
                        return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
                    } else {
                        return responses.successMsg(res, null);
                    }
                });
            }

        });
    });
};

exports.paytmPayment = function (req, res) {
    let orderID = 'order_' + req.body.email + '_' + new Date().getTime();
    let params = {
        'MID': config.paytmMerchantID,
        'ORDER_ID': orderID,
        'CUST_ID': req.body.email,
        'TXN_AMOUNT': req.body.amount,
        'CHANNEL_ID': 'WEB',
        'WEBSITE': 'WEBSTAGING',
        'INDUSTRY_TYPE_ID': 'Retail',
        'CALLBACK_URL': 'https://screenshot.hexerve.com/noscam/:8000/payment/paytm/response',
        //'https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID=' + orderID,
        // 'CALLBACK_URL': 'http://hexervesolutions.com/a?ORDER_ID=' + orderID,
        // https://developer.paytm.com/txn-response
        // 'txn_url': "https://securegw-stage.paytm.in/theia/processTransaction", // for staging
        // 'txn_url': "https://securegw.paytm.in/theia/processTransaction", // for prod
    };

    Checksum.genchecksum(params, config.paytmSecretKey, function (err, checksum) {
        if (err) {
            return res.send({
                'status': "Error occured"
            });
        }
        params.CHECKSUMHASH = checksum;

        return responses.successMsg(res, params);
    });
};

exports.paytmPaymentResponse = function (req, res) {
    let isValid = Checksum.verifychecksum(req.body, config.paytmSecretKey);
    if (!isValid) {
        return res.send({
            'status': "Error occured"
        });
    }

    request.post(
        'https://securegw-stage.paytm.in/merchant-status/getTxnStatus', {
            json: {
                "MID": config.paytmMerchantID,
                "ORDERID": req.body.ORDERID,
                "CHECKSUMHASH": req.body.CHECKSUMHASH
            }
        },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                let email = body.ORDERID.substring(body.ORDERID.indexOf('_') + 1, body.ORDERID.lastIndexOf('_'));
                Transaction.create({
                    email: email,
                    amount: parseFloat(body.TXNAMOUNT),
                    txnID: body.TXNID
                }, function (err, response) {
                    if (err) {
                        console.log(err);
                    }
                    console.log(response);

                    userController.addMoney(req, res, email, body.TXNAMOUNT, function (result) {
                        if (!result) {
                            return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
                        } else {
                            return responses.successMsg(res, "payment succesfully completed"); //redirect to payment page
                        }
                    });
                });

            } else {
                console.log(error);
            }
        }
    );

};