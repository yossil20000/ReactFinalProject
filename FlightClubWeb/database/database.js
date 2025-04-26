var mongoose = require('mongoose');
var log = require('debug-level').log('database');
//Set up default mongoose connection
var mongoDB =  process.env.MONGODB_URL === undefined ? 'mongodb://127.0.0.1/AAA' :  process.env.MONGODB_URL;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('debug', false);
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', log.error.bind(console, 'MongoDB connection error:'));
db.once('open',() => {
  log.log("Mongoose Db connected")
});
module.exports = db;