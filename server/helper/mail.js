var ejs = require("ejs");
var config = require('../config');
var transporter = config.transporter;

module.exports.verification_mail = function (email, link) {
    ejs.renderFile(__dirname + "/email.ejs", {
        task: 'Verify Your Account',
        taskhref: link
    }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            var mailOptions = {
                to: email,
                from: 'Hexerve Solutions <info@hexerve.com>',
                subject: 'Account Verification',
                html: data
            };
            transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }
    });
};

module.exports.forgetPass_mail = function (email, link) {
    ejs.renderFile(__dirname + "/email.ejs", {
        task: 'Reset Password',
        taskhref: link
    }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            var mailOptions = {
                to: email,
                from: 'Hexerve Solutions <info@hexerve.com>',
                subject: 'Password reset link',
                //html: '<p>Please visit the following link to reset your password</p> <br/>' + link
                html: data
            };
            transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }
    });
};

module.exports.passUpdate_mail = function (email) {
    ejs.renderFile(__dirname + "/email.ejs", {
        task: 'Update Password'
    }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            var mailOptions = {
                to: email,
                from: 'Hexerve Solutions <info@hexerve.com>',
                subject: 'Password Updated',
                html: data
            };
            transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }
    });
};

module.exports.invoice = function (email, amount) {
    ejs.renderFile(__dirname + "/email.ejs", {
        task: 'invoice',
        amount: amount,
    }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            var mailOptions = {
                to: email,
                from: 'Hexerve Solutions <info@hexerve.com>',
                subject: 'Payment Recieved',
                html: data
            };
            transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }
    });
};

module.exports.addAmount = function (email, amount) {
    ejs.renderFile(__dirname + "/email.ejs", {
        task: 'addAmount',
        amount: amount,
    }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            var mailOptions = {
                to: email,
                from: 'Hexerve Solutions <info@hexerve.com>',
                subject: 'Amount added to wallet',
                html: data
            };
            transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }
    });
};