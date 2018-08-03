'use strict';
module.exports = function (app) {
    var responses = require('../helper/responses');

    var errors, results;

    // Routes
    app.get("/", function (req, res) {
        results = {
            "message": "you have successfully reached the api"
        };
        return responses.successMsg(res, results);
    });

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