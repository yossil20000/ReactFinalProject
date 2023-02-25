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
const flightRouter = require('./routes/flight');
const imageRouter = require('./routes/image');
const accountRouter = require('./routes/account');
const orderRouter = require('./routes/order');
const clubAccountRouter = require('./routes/clubAccount');
const typeRouter = require('./routes/type');
const notificationRouter = require('./routes/notification');

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
app.use(express.json({limit: '25mb'}));
app.use(express.urlencoded({limit: '25mb', extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/members', membersRouter);
app.use('/api/devices', deviceRouter);
app.use('/api/deviceTypes', deviceTypeRouter);
app.use('/api/reservation', flightReservRouter);
app.use('/api', loginRouter);
app.use('/api/memberships', membershipRouter);
app.use('/api/club_notice', clubNoticeRouter);
app.use("/api/flight", flightRouter);
app.use("/api/images",imageRouter);
app.use('/api/accounts',accountRouter);
app.use('/api/orders',orderRouter);
app.use('/api/club_account',clubAccountRouter);
app.use('/api/type',typeRouter);
app.use('/api/notification',notificationRouter);

app.use((err, req, res, next) => {
  console.error('\x1b[31m',err);
  next(err);
});
// catch 404 and forward to error handler
/* app.use(function(req, res, next) {
  next(createError(404));
});
 */
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  /*   res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {}; */
  /*   {
      "success": false,
      "errorSource": "CONTROLLER.DEVICE.STATUS.DB",
      "errorType": "MongoServerError",
      "errors": [
          "Performing an update on the path '_id' would modify the immutable field '_id'"
      ]
  } */
  // render the error page
  if (err instanceof ApplicationError)
    res.status(err.errorCode).json({  "success": false, ...err.serializeError() });
  else 
  res.status(500).json({"success": false , errors: ["General Error"]});
  return
});
var userArgs = process.argv.slice(2);
console.log(userArgs);
const loadApi = require("./loadApi");
const { dbs } = require('./database/database');
const { ApplicationError } = require("./middleware/baseErrors");
if (userArgs[0] == "yossi") {
  console.log(userArgs[0]);
  loadApi(process.env.LOAD_API_ADDRESS).then(function (res) {
    console.log('Sync result:', res);

    res.forEach((element, index) => {
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
