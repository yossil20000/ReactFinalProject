var mongoose = require('mongoose');
var log = require('debug-level').log('database');
//Set up default mongoose connection
/* var mongoDB =  process.env.MONGODB_URL_CLUSTER_CLUB === undefined ? 'mongodb://127.0.0.1/AAA' :  process.env.MONGODB_URL_CLUSTER_CLUB;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('debug', false);
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', log.error.bind(console, `MongoDB connection error: ${mongoDB}`));
db.once('open',() => {
  log.log("Mongoose Db connected")
}); */


const uri =process.env.MONGODB_URL_CLUSTER_CLUB || "mongodb+srv://yossil2000:Tyy2000@clusterclub.67dzuqd.mongodb.net/BazClub?appName=ClusterClub";
  /* "mongodb+srv://yossil2000:Tyy2000@clusterclub.67dzuqd.mongodb.net/BazClub?appName=ClusterClub"; */

mongoose.connect(uri)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));
  var db = mongoose.connection;
module.exports = db;