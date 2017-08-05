//mongoDB setup
var mongoose = require('mongoose');    
var uri = 'mongodb://admin:6239@ds145208.mlab.com:45208/aavdatabase';//todo: hide username and password
mongoose.connect(uri, { useMongoClient: true}); 
var db = mongoose.connection;

require('./models/user');
require('./models/survey');

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
