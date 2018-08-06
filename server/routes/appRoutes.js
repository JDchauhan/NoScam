'use strict';
module.exports = function (app) {
    var VerifyToken = require('../helper/verifyToken');
    var responses = require('../helper/responses');

    var User = require('../controllers/userController');

    var errors, results;

    // Routes
    app.get("/", function (req, res) {
        results = {
            "message": "you have successfully reached the api"
        };
        return responses.successMsg(res, results);
    });

    app.post('/login', User.login);

    app.get('/verify/email/:token', VerifyToken, User.verify);

    app.post('/verify/email', User.sendVerificationLink);

    app.post('/user', User.register);

    app.get('/user', VerifyToken, User.current_user);

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