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
var Device = require('./Models/device');
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

function createEhud2022FlightsBtch(callback) {
 
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
function createYose2022FlightsBtch(callback) {
 
  createFlight('059828392',"4XCGC",542.6,543.2,new Date(2022,1,12),"",0,callback)
  createFlight('059828392',"4XCGC",545.0,545.6,new Date(2022,1,15),"",0,callback)
  createFlight('059828392',"4XCGC",555.8,556.5,new Date(2022,2,8),"",0,callback)
  createFlight('059828392',"4XCGC",560.3,560.9,new Date(2022,2,20),"",0,callback)
  createFlight('059828392',"4XCGC",561.5,562.8,new Date(2022,2,26),"",0,callback)
  createFlight('059828392',"4XCGC",577.3,578.2,new Date(2022,3,22),"",0,callback)
  createFlight('059828392',"4XCGC",618.1,618.8,new Date(2022,6,8),"",0,callback)
  createFlight('059828392',"4XCGC",642.6,643.3,new Date(2022,7,6),"",0,callback)
  createFlight('059828392',"4XCGC",667.6,668.8,new Date(2022,8,27),"",0,callback)
  createFlight('059828392',"4XCGC",684.6,685.7,new Date(2022,9,22),"",0,callback)
  
}
function createUriEitan2022FlightsBtch(callback) {
 
  createFlight('000007000',"4XCGC",529,530.2,new Date(2022,0,17),"",0,callback)
  createFlight('000007000',"4XCGC",548.2,548.9,new Date(2022,1,22),"",0,callback)
  createFlight('000007000',"4XCGC",549.5,550.1,new Date(2022,1,22),"",0,callback)
  createFlight('000007000',"4XCGC",558.3,559.3,new Date(2022,2,17),"",0,callback)
  createFlight('000007000',"4XCGC",570.1,571.8,new Date(2022,2,31),"",0,callback)
  createFlight('000007000',"4XCGC",579.6,581.2,new Date(2022,3,29),"",0,callback)
  createFlight('000007000',"4XCGC",586.6,587.7,new Date(2022,4,11),"",0,callback)
  createFlight('000007000',"4XCGC",609.7,610.4,new Date(2022,6,1),"",0,callback)
  createFlight('000007000',"4XCGC",624.3,625.0,new Date(2022,6,14),"",0,callback)
  createFlight('000007000',"4XCGC",649.7,650.8,new Date(2022,7,24),"",0,callback)
  createFlight('000007000',"4XCGC",663.0,664.1,new Date(2022,8,16),"",0,callback)
  createFlight('000007000',"4XCGC",668.8,669.9,new Date(2022,8,30),"",0,callback)
  createFlight('000007000',"4XCGC",678.4,679.2,new Date(2022,9,11),"",0,callback)
  createFlight('000007000',"4XCGC",686.3,687.9,new Date(2022,9,28),"",0,callback)

  
}
function createEizental2022FlightsBtch(callback) {
 
  createFlight('000001000',"4XCGC",526.1,526.5,new Date(2022,0,5),"",0,callback)
  createFlight('000001000',"4XCGC",530.7,531.4,new Date(2022,0,20),"",0,callback)
  createFlight('000001000',"4XCGC",537.1,537.7,new Date(2022,1,8),"",0,callback)
  createFlight('000001000',"4XCGC",540.7,541.2,new Date(2022,1,12),"",0,callback)
  createFlight('000001000',"4XCGC",554.8,555.8,new Date(2022,2,8),"",0,callback)
  createFlight('000001000',"4XCGC",567.3,568.5,new Date(2022,2,29),"",0,callback)
  createFlight('000001000',"4XCGC",575.7,576.3,new Date(2022,3,20),"",0,callback)
  createFlight('000001000',"4XCGC",592.2,592.7,new Date(2022,4,23),"",0,callback)
  createFlight('000001000',"4XCGC",617.0,618.1,new Date(2022,6,8),"",0,callback)
  createFlight('000001000',"4XCGC",651.9,653.4,new Date(2022,7,26),"",0,callback)
  createFlight('000001000',"4XCGC",655.1,657.4,new Date(2022,8,9),"",0,callback)
  createFlight('000001000',"4XCGC",665.9,667.3,new Date(2022,8,23),"",0,callback)
  createFlight('000001000',"4XCGC",677.2,678.4,new Date(2022,9,11),"",0,callback)

  
}
function createFux2022FlightsBtch(callback) {
 
  createFlight('000010000',"4XCGC",526.5,527.9,new Date(2022,0,6),"",0,callback)
  createFlight('000010000',"4XCGC",551.9,552.3,new Date(2022,1,28),"",0,callback)
  createFlight('000010000',"4XCGC",556.5,557.9,new Date(2022,2,16),"",0,callback)
  createFlight('000010000',"4XCGC",576.3,576.8,new Date(2022,3,21),"",0,callback)
  createFlight('000010000',"4XCGC",576.8,577.3,new Date(2022,3,21),"",0,callback)
  createFlight('000010000',"4XCGC",591.7,591.9,new Date(2022,4,22),"",0,callback)
  createFlight('000010000',"4XCGC",600.0,600.9,new Date(2022,5,6),"",0,callback)
  createFlight('000010000',"4XCGC",608.4,609.6,new Date(2022,5,27),"",0,callback)
  createFlight('000010000',"4XCGC",612.0,613.6,new Date(2022,6,3),"",0,callback)
  createFlight('000010000',"4XCGC",621.5,623.0,new Date(2022,6,10),"",0,callback)
  createFlight('000010000',"4XCGC",636.5,638.0,new Date(2022,6,24),"",0,callback)
  createFlight('000010000',"4XCGC",640.2,641.8,new Date(2022,7,1),"",0,callback)
  createFlight('000010000',"4XCGC",669.9,671.3,new Date(2022,9,2),"",0,callback)
  createFlight('000010000',"4XCGC",573.2,674.5,new Date(2022,9,9),"",0,callback)
  
  
}
function createGiora2022FlightsBtch(callback) {
 
  createFlight('000009000',"4XCGC",530.2,530.7,new Date(2022,0,18),"",0,callback)
  createFlight('000009000',"4XCGC",533.9,534.9,new Date(2022,0,25),"",0,callback)
  createFlight('000009000',"4XCGC",536.7,537.1,new Date(2022,1,6),"",0,callback)
  createFlight('000009000',"4XCGC",545.7,546.4,new Date(2022,1,17),"",0,callback)
  createFlight('000009000',"4XCGC",557.9,558.3,new Date(2022,2,16),"",0,callback)
  createFlight('000009000',"4XCGC",568.5,569.0,new Date(2022,2,30),"",0,callback)
  createFlight('000009000',"4XCGC",574.1,574.8,new Date(2022,3,10),"",0,callback)
  createFlight('000009000',"4XCGC",579.0,579.6,new Date(2022,3,28),"",0,callback)
  createFlight('000009000',"4XCGC",584.6,585.7,new Date(2022,4,8),"",0,callback)
  createFlight('000009000',"4XCGC",596.1,596.5,new Date(2022,4,29),"",0,callback)
  createFlight('000009000',"4XCGC",600.9,601.6,new Date(2022,5,8),"",0,callback)
  createFlight('000009000',"4XCGC",601.6,602.1,new Date(2022,5,8),"",0,callback)
  createFlight('000009000',"4XCGC",614.1,615.0,new Date(2022,6,4),"",0,callback)
  createFlight('000009000',"4XCGC",623.3,623.9,new Date(2022,6,11),"",0,callback)
  createFlight('000009000',"4XCGC",638.0,638.4,new Date(2022,6,25),"",0,callback)
  createFlight('000009000',"4XCGC",638.9,639.5,new Date(2022,6,26),"",0,callback)
  createFlight('000009000',"4XCGC",644.3,644.9,new Date(2022,7,8),"",0,callback)
  createFlight('000009000',"4XCGC",644.9,645.4,new Date(2022,7,8),"",0,callback)
  createFlight('000009000',"4XCGC",654.7,655.1,new Date(2022,8,6),"",0,callback)
  createFlight('000009000',"4XCGC",671.3,671.9,new Date(2022,9,6),"",0,callback)
  createFlight('000009000',"4XCGC",671.9,672.6,new Date(2022,9,6),"",0,callback)
  createFlight('000009000',"4XCGC",682.5,683.1,new Date(2022,9,18),"",0,callback)
  createFlight('000009000',"4XCGC",684.1,684.6,new Date(2022,9,21),"",0,callback)
  
  
}
function createGolan2022FlightsBtch(callback) {
 
  createFlight('000012000',"4XCGC",537.7,538.0,new Date(2022,1,9),"",0,callback)
  createFlight('000012000',"4XCGC",546.4,547.4,new Date(2022,1,18),"",0,callback)
  createFlight('000012000',"4XCGC",552.3,553.6,new Date(2022,2,2),"",0,callback)
  createFlight('000012000',"4XCGC",587.7,579.0,new Date(2022,3,25),"",0,callback)
  createFlight('000012000',"4XCGC",588.9,590.4,new Date(2022,4,13),"",0,callback)
  createFlight('000012000',"4XCGC",623.0,623.3,new Date(2022,6,10),"",0,callback)
  createFlight('000012000',"4XCGC",650.8,651.4,new Date(2022,7,25),"",0,callback)
  createFlight('000012000',"4XCGC",659.1,661.1,new Date(2022,8,10),"",0,callback)
  createFlight('000012000',"4XCGC",661.1,663.0,new Date(2022,8,11),"",0,callback)
  
  
}
function createBoris2022FlightsBtch(callback) {
 
  createFlight('000011000',"4XCGC",623.9,624.2,new Date(2022,6,11),"",0,callback)
  createFlight('000011000',"4XCGC",625.0,626.1,new Date(2022,6,15),"",0,callback)
  createFlight('000011000',"4XCGC",626.1,627.0,new Date(2022,6,16),"",0,callback)
  createFlight('000011000',"4XCGC",636.1,635.5,new Date(2022,6,23),"",0,callback)
  createFlight('000011000',"4XCGC",639.6,640.2,new Date(2022,6,27),"",0,callback)
  createFlight('000011000',"4XCGC",643.3,644.3,new Date(2022,7,6),"",0,callback)
  createFlight('000011000',"4XCGC",657.4,658.8,new Date(2022,8,9),"",0,callback)
  createFlight('000011000',"4XCGC",672.6,673.2,new Date(2022,9,6),"",0,callback)
  createFlight('000011000',"4XCGC",674.5,675.4,new Date(2022,9,9),"",0,callback)
  createFlight('000011000',"4XCGC",680.9,681.9,new Date(2022,9,15),"",0,callback)
  createFlight('000011000',"4XCGC",685.7,686.3,new Date(2022,9,24),"",0,callback)
  
  
}

function createAzriel2022FlightsBtch(callback) {
 
  createFlight('000002000',"4XCGC",527.9,528.9,new Date(2022,0,7),"",0,callback)
  createFlight('000002000',"4XCGC",541.7,542.6,new Date(2022,1,12),"",0,callback)
  createFlight('000002000',"4XCGC",547.4,548.2,new Date(2022,1,19),"",0,callback)
  createFlight('000002000',"4XCGC",559.3,559.8,new Date(2022,2,18),"",0,callback)
  createFlight('000002000',"4XCGC",599.3,600.0,new Date(2022,5,4),"",0,callback)
  createFlight('000002000',"4XCGC",603.9,604.9,new Date(2022,5,11),"",0,callback)
  createFlight('000002000',"4XCGC",608.0,608.4,new Date(2022,5,25),"",0,callback)
  createFlight('000002000',"4XCGC",610.4,610.9,new Date(2022,6,1),"",0,callback)
  createFlight('000002000',"4XCGC",627.9,629.7,new Date(2022,6,17),"",0,callback)
  createFlight('000002000',"4XCGC",645.4,647.1,new Date(2022,7,9),"",0,callback)
  createFlight('000002000',"4XCGC",647.1,648.7,new Date(2022,7,10),"",0,callback)
  createFlight('000002000',"4XCGC",654.0,654.4,new Date(2022,8,2),"",0,callback)
  createFlight('000002000',"4XCGC",654.4,654.7,new Date(2022,8,2),"",0,callback)
  
  
}
function createDov2022FlightsBtch(callback) {
 
  createFlight('000004000',"4XCGC",534.9,535.5,new Date(2022,0,25),"",0,callback)
  createFlight('000004000',"4XCGC",543.2,544.0,new Date(2022,1,13),"",0,callback)
  createFlight('000004000',"4XCGC",550.4,551.0,new Date(2022,1,23),"",0,callback)
  createFlight('000004000',"4XCGC",560.9,561.5,new Date(2022,2,22),"",0,callback)
  createFlight('000004000',"4XCGC",573.4,574.1,new Date(2022,3,4),"",0,callback)
  createFlight('000004000',"4XCGC",585.7,586.6,new Date(2022,4,8),"",0,callback)
  createFlight('000004000',"4XCGC",587.7,588.9,new Date(2022,4,11),"",0,callback)
  createFlight('000004000',"4XCGC",598.0,598.6,new Date(2022,5,1),"",0,callback)
  createFlight('000004000',"4XCGC",606.6,607.0,new Date(2022,5,21),"",0,callback)
  createFlight('000004000',"4XCGC",615.4,615.9,new Date(2022,6,6),"",0,callback)
  createFlight('000004000',"4XCGC",664.1,664.6,new Date(2022,8,19),"",0,callback)
  createFlight('000004000',"4XCGC",676.5,677.2,new Date(2022,9,11),"",0,callback)
  
  
}

function createOren2022FlightsBtch(callback) {
 
  createFlight('000008000',"4XCGC",531.4,532.3,new Date(2022,0,21),"",0,callback)
  createFlight('000008000',"4XCGC",548.9,549.5,new Date(2022,1,22),"",0,callback)
  createFlight('000008000',"4XCGC",550.1,550.4,new Date(2022,1,22),"",0,callback)
  createFlight('000008000',"4XCGC",559.8,560.3,new Date(2022,2,19),"",0,callback)
  createFlight('000008000',"4XCGC",571.8,573.4,new Date(2022,3,1),"",0,callback)
  createFlight('000008000',"4XCGC",581.2,582.9,new Date(2022,3,29),"",0,callback)
  createFlight('000008000',"4XCGC",591.9,592.2,new Date(2022,4,22),"",0,callback)
  createFlight('000008000',"4XCGC",592.7,594.5,new Date(2022,4,26),"",0,callback)
  createFlight('000008000',"4XCGC",594.5,596.1,new Date(2022,4,28),"",0,callback)
  createFlight('000008000',"4XCGC",605.6,606.6,new Date(2022,5,16),"",0,callback)
  createFlight('000008000',"4XCGC",629.7,631.2,new Date(2022,6,18),"",0,callback)
  createFlight('000008000',"4XCGC",635.6,636.1,new Date(2022,6,23),"",0,callback)
  createFlight('000008000',"4XCGC",651.4,651.9,new Date(2022,7,26),"",0,callback)
  createFlight('000008000',"4XCGC",658.8,659.1,new Date(2022,8,9),"",0,callback)
  createFlight('000008000',"4XCGC",664.6,665.9,new Date(2022,8,23),"",0,callback)
  createFlight('000008000',"4XCGC",681.9,682.5,new Date(2022,9,16),"",0,callback)
  createFlight('000008000',"4XCGC",683.2,684.1,new Date(2022,9,20),"",0,callback)
  createFlight('000008000',"4XCGC",687.9,689.4,new Date(2022,9,29),"",0,callback)
  
  
}

function createOaad2022FlightsBtch(callback) {
 
  createFlight('000006000',"4XCGC",578.2,578.7,new Date(2022,3,23),"",0,callback)
  createFlight('000006000',"4XCGC",582.9,583.7,new Date(2022,4,7),"",0,callback)
  createFlight('000006000',"4XCGC",583.7,584.6,new Date(2022,4,7),"",0,callback)
  createFlight('000006000',"4XCGC",590.4,591.0,new Date(2022,4,17),"",0,callback)
  createFlight('000006000',"4XCGC",591.1,591.7,new Date(2022,4,20),"",0,callback)
  createFlight('000006000',"4XCGC",598.6,599.3,new Date(2022,5,3),"",0,callback)
  createFlight('000006000',"4XCGC",603.0,603.9,new Date(2022,5,10),"",0,callback)
  createFlight('000006000',"4XCGC",607.5,608.0,new Date(2022,5,24),"",0,callback)
  createFlight('000006000',"4XCGC",621.1,621.5,new Date(2022,6,9),"",0,callback)
  createFlight('000006000',"4XCGC",627.0,627.9,new Date(2022,6,16),"",0,callback)
  createFlight('000006000',"4XCGC",632.2,634.2,new Date(2022,6,21),"",0,callback)
  createFlight('000006000',"4XCGC",634.2,635.6,new Date(2022,6,22),"",0,callback)
  createFlight('000006000',"4XCGC",641.8,642.6,new Date(2022,7,5),"",0,callback)
  createFlight('000006000',"4XCGC",653.4,654.0,new Date(2022,7,27),"",0,callback)
  createFlight('000006000',"4XCGC",667.3,667.6,new Date(2022,8,23),"",0,callback)
  createFlight('000006000',"4XCGC",675.4,676.5,new Date(2022,9,10),"",0,callback)
  createFlight('000006000',"4XCGC",679.2,679.7,new Date(2022,9,13),"",0,callback)
  createFlight('000006000',"4XCGC",679.7,680.2,new Date(2022,9,15),"",0,callback)
  createFlight('000006000',"4XCGC",680.2,680.9,new Date(2022,9,15),"",0,callback)
  
  
}






readline.question(`Do You Want to Delete (YeS)?`, ans => {

  console.log(`Hi ${ans}!`)

  if (ans == 'YeS') {
    async.waterfall([
      importData,
      createOaad2022FlightsBtch
      
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