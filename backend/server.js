

const express = require('express'),
app = express(),
bodyParser = require('body-parser');
port = process.env.PORT || 4000;



app.listen(port);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// var routes = require('./app/routes/routes'); //importing route
// routes(app); //register the route


