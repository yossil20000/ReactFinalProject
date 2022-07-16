require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var cors = require("cors");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var log = require('debug-level').log('app');

// Routs

var membersRouter = require('./routes/member');
var deviceRouter = require('./routes/device');
const deviceTypeRouter = require('./routes/deviceType');
const flightReservRouter = require('./routes/flightReservation');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
const membershipRouter = require('./routes/membership');
const clubNoticeRouter = require('./routes/clubNotice');
var app = express();

//Import the mongoose module
var db = require('./database/database');
/* var mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB =  process.env.MONGODB_URL === undefined ? 'mongodb://127.0.0.1/AAA' :  process.env.MONGODB_URL;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open',() => {
  log.log("Mongoose Db connected")
}); */

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/members', membersRouter);
app.use('/api/devices', deviceRouter);
app.use('/api/deviceTypes', deviceTypeRouter);
app.use('/api/reservation', flightReservRouter);
app.use('/api',loginRouter);
app.use('/api/memberships', membershipRouter);
app.use('/api/club_notice',clubNoticeRouter)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
var userArgs = process.argv.slice(2);
console.log(userArgs);
const loadApi = require("./loadApi");
const { dbs } = require('./database/database');
if(userArgs[0] == "yossi" )
{
  console.log(userArgs[0]);
   loadApi(process.env.LOAD_API_ADDRESS).then(function(res) {
    console.log('Sync result:', res);
    
    res.forEach((element,index) => {
      console.log(`${index}`);
      console.log(element);
     db.collection("cripto").insertOne(element);
    });
    
  }
    
  );
  
/*   (async function main() {
    var result = await loadApi(process.env.LOAD_API_ADDRESS);
    
  
    console.log('async result:', result);
})() */
}
module.exports = app;
