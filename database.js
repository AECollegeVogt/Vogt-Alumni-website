//mongoDB setup
var mongoose = require('mongoose'); 
var config = require('./config');

var uri = config.db.url;
mongoose.connect(uri, { useMongoClient: true}); 
var db = mongoose.connection;

require('./models/user');
require('./models/survey');

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
