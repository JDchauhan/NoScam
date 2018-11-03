var mongoose = require('mongoose');
var Transaction = require('../models/transactionModel');
Transaction = mongoose.model('transaction');

var userController = require('../controllers/userController');
var config = require('../config');

var stripe = require("stripe")(config.stripeKey);


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
}

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
                userController.addMoney(req, res, pd.email, pd.net_amount_debit);
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
            }
        });

        userController.addMoney(req, res, req.body.token.email, req.body.amount / 100);
    });
};