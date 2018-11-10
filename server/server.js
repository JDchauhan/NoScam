var express = require('express'),
    app = express(),
    port = process.env.PORT || 8000,
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_CONNECTION_NOSCAM, {
    useNewUrlParser: true
});

app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));
app.use(bodyParser.json({
    limit: '50mb',
    extended: true
}));

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

var routes = require('./routes/appRoutes');
routes(app);

app.listen(port);

console.log('RESTful API server started on: ' + port);