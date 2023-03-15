#! /usr/bin/env node
require('dotenv').config()
//console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Member = require('./Models/member');
var Device = require('./models/device')
var Flight = require('./Models/flight');
const CE = require('./Models/constants');
let mongoose = require('mongoose');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})


var mongoDB = userArgs[0] === undefined ? process.env.MONGODB_URL : userArgs[0];
//console.log(mongoDB);

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
let members = [];
let devices = [];
let flights = [];
const importData = async () => {
  try {
    members = await Member.find();
    devices = await Device.find();
  }
  catch (error) {
    console.log('error', error);
  }
}

function createFlight(memberId, deviceId, engienStart, engienStop, date, description, duration, cb) {
  const member = members.find((item) => item.member_id === memberId);
  const device = devices.find((item) => item.device_id === deviceId);
  if (member && device) {
    let flight = new Flight({
      description: description,
      date: date,
      hobbs_start: 0,
      hobbs_stop: 0,
      engien_start: engienStart,
      engien_stop: engienStop,
      status: 'CREATED',
      device: device._id,
      member: member._id,
      reuired_hobbs: device.reuired_hobbs,
      duration: duration,
      timeOffset: 120
    })
    flight.save(function (err) {
      if(err) { cb(err, null); return; }
      console.log('New Flight: ', flight);
      flights.push(flight)
    });
  }

}

function createFlights(cb) {
  async.series([
    function(callback) {
      createFlight('000003000',"4XCGC",533.0,533.9,new Date(2022,1,25),"",0,callback)
    },
    function(callback) {
      createFlight('000003000',"4XCGC",535.5,535.9,new Date(2022,2,2),"",0,callback)
    },
    function(callback) {
      createFlight('000003000',"4XCGC",535.9,536.7,new Date(2022,2,6),"",0,callback)
    },
    function(callback) {
      createFlight('000003000',"4XCGC",544.0,545.0,new Date(2022,2,13),"",0,callback)
    },
    function(callback) {
      createFlight('000003000',"4XCGC",551.0,551.4,new Date(2022,2,23),"",0,callback)
    },
    function(callback) {
      createFlight('000003000',"4XCGC",551.4,551.9,new Date(2022,2,27),"",0,callback)
    },
    function(callback) {
      createFlight('000003000',"4XCGC",553.6,554.2,new Date(2022,3,8),"",0,callback)
    },
    function(callback) {
      createFlight('000003000',"4XCGC",554.2,554.8,new Date(2022,3,8),"",0,callback)
    },
    function(callback) {
      createFlight('000003000',"4XCGC",569.0,569.4,new Date(2022,3,30),"",0,callback)
    },
    function(callback) {
      createFlight('000003000',"4XCGC",574.8,575.7,new Date(2022,4,17),"",0,callback)
    },
    function(callback) {
      createFlight('000003000',"4XCGC",596.5,597.4,new Date(2022,5,29),"",0,callback)
    },
    function(callback) {
      createFlight('000003000',"4XCGC",597.4,598.0,new Date(2022,6,1),"",0,callback)
    },
    function(callback) {
      createFlight('000003000',"4XCGC",607.0,607.5,new Date(2022,6,21),"",0,callback)
    },
    function(callback) {
      createFlight('000003000',"4XCGC",615.0,615.4,new Date(2022,7,6),"",0,callback)
    },
    function(callback) {
      createFlight('000003000',"4XCGC",631.2,632.2,new Date(2022,7,20),"",0,callback)
    },
    function(callback) {
      createFlight('000003000',"4XCGC",638.4,638.9,new Date(2022,7,25),"",0,callback)
    },
    function(callback) {
      createFlight('000003000',"4XCGC",648.8,649.7,new Date(2022,8,23),"",0,callback)
    }
  ],cb)
}
function createFlightsBtch(callback) {
 
      createFlight('000003000',"4XCGC",533.0,533.9,new Date(2022,0,25),"",0,callback)
      createFlight('000003000',"4XCGC",535.5,535.9,new Date(2022,1,2),"",0,callback)
      createFlight('000003000',"4XCGC",535.9,536.7,new Date(2022,1,6),"",0,callback)
      createFlight('000003000',"4XCGC",544.0,545.0,new Date(2022,1,13),"",0,callback)
      createFlight('000003000',"4XCGC",551.0,551.4,new Date(2022,1,23),"",0,callback)
      createFlight('000003000',"4XCGC",551.4,551.9,new Date(2022,1,27),"",0,callback)
      createFlight('000003000',"4XCGC",553.6,554.2,new Date(2022,2,8),"",0,callback)
      createFlight('000003000',"4XCGC",554.2,554.8,new Date(2022,2,8),"",0,callback)
      createFlight('000003000',"4XCGC",569.0,569.4,new Date(2022,2,30),"",0,callback)
      createFlight('000003000',"4XCGC",574.8,575.7,new Date(2022,3,17),"",0,callback)
      createFlight('000003000',"4XCGC",596.5,597.4,new Date(2022,4,29),"",0,callback)
      createFlight('000003000',"4XCGC",597.4,598.0,new Date(2022,5,1),"",0,callback)
      createFlight('000003000',"4XCGC",607.0,607.5,new Date(2022,5,21),"",0,callback)
      createFlight('000003000',"4XCGC",615.0,615.4,new Date(2022,6,6),"",0,callback)
      createFlight('000003000',"4XCGC",631.2,632.2,new Date(2022,6,20),"",0,callback)
      createFlight('000003000',"4XCGC",638.4,638.9,new Date(2022,6,25),"",0,callback)
      createFlight('000003000',"4XCGC",648.8,649.7,new Date(2022,7,23),"",0,callback)
    
}


readline.question(`Do You Want to Delete (YeS)?`, ans => {

  console.log(`Hi ${ans}!`)

  if (ans == 'YeS') {
    async.waterfall([
      importData,
      createFlightsBtch
      
    ],
      // Optional callback
      function (err, results) {
        if (err) {
          console.log('FINAL ERR: ' + err);
        }
        else {
          console.log('Members: ' + members);

        }
        // All done, disconnect from database
        mongoose.connection.close();
      });



  }
  else {
    throw "Exit";
  }
  readline.close();
});