var express = require('express');
var app = express();
var logger = require('morgan');
var path = require('path');
var bodyParser = require('body-parser');
var pg = require('pg');

app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.static( path.join(__dirname, 'views')));

app.get('/views', function(req, res, next){
	res.send('I Did it');

});

//catching 404 and 500 errors
app.use(function(req, res) {
  res.status(404);
  res.send("404!");
});

app.use(function(err, req, res, next) {
  res.status(500);
  res.send("500!");
});

app.listen(3000);