#! /usr/bin/env node
require('dotenv').config();
const constants = require('./Models/constants');
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
var DeviceType = require('./Models/deviceType')
var Device = require('./models/device')
var Member = require('./Models/member')
var FlightReservation = require('./Models/flightReservation');

var mongoose = require('mongoose');
var mongoDB = userArgs[0] === undefined ? process.env.MONGODB_URL : userArgs[0];
console.log(mongoDB);

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
const dropCollection = require('./dropCollection');

//dropCollection(["devicetypes"],mongoose);
let collections = ["devicetypes",'members','devices','flightreservations'];
let dropCollections = function() {
    //var collections = _.keys(mongoose.connection.collections)
    collections.forEach( collectionName => {
      var collection = mongoose.connection.collections[collectionName]
        console.log(collection);
      collection.drop(function(err) {
        if (err && err.message != 'ns not found') console.log("Drop Done:" +err)
        console.log("Drop Done:" +null)
      })
    })
  } 

//dropCollections();

const devices = []
const deviceTypes = [];
const flightReservations =[];
const flights =[];
const members =[];
function memberCreate(first_name, family_name, d_birth, d_join, memberId,roll,phone,email, cb) {
    memberdetail = {
         first_name: first_name, family_name: family_name, member_id: memberId,
         roll: constants.ROLLS[roll],
         contact:{phone: phone,email: email}
        }
    if (d_birth != false) memberdetail.date_of_birth = d_birth
    if (d_join != false) memberdetail.date_of_join = d_join

    var member = new Member(memberdetail);

    member.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Member: ' + member);
        members.push(member)
        cb(null, member)
    });
}
function createMembers(cb) {
    async.series([
        function (callback) {
            memberCreate("Yosef", "Levy", "1965-08-21", "2011-11-01", "059828394",4,"0549074755","yos@gmail", callback);
        },
        function (callback) {
            memberCreate("Giora", "Yahel", "1966-09-22", "2012-12-02", "259828392",0,"0549074755","yos@gmail", callback);
        }
    ],
        cb
    );
}

function deviceTypeCreate(name,description,category,engien,surface ,cb){
    let deviceTypeDetail = {
        name: name,
        category: category,
        class:{
            surface: surface,
            engien: engien
        },
        description: description
    }
    let deviceType = new DeviceType(deviceTypeDetail);
    deviceType.save(function(err)  {
        if(err) {cb(err,null); return;}
        console.log('New DeviceType:' + deviceType);
        deviceTypes.push(deviceType);
        cb(null,deviceType);

    });

}
function deviceCreate(device_id,device_type, description,available,device_status,due_date,hobbs_meter, engien_meter, cb){
    let deviceDetail = {
        device_id: device_id,
        device_type: device_type,
        description: description,
        available: available,
        device_status: device_status,
        due_date: due_date,
        hobbs_meter: hobbs_meter,
        engien_meter: engien_meter
    }
    deviceDetail.price.base = 420.4;
    deviceDetail.hobbs_meter = 345.6;
    deviceDetail.engien_meter= 245.7;
    deviceDetail.maintanance.next_meter = 5670.6;
    deviceDetail.description.image= 'https://www.google.com/search?q=airplane+images&sxsrf=APq-WBtm62ecKiz4huAVdDnYbGDgBYIrLw:1647066931349&tbm=isch&source=iu&ictx=1&vet=1&fir=dJ-ns3zOOG2WjM%252C8pJNRpwZOAYayM%252C_%253BeSVzIEk_N-h10M%252CWITfi61mVOl_gM%252C_%253BK8fp99P4ei9q5M%252CfdhhcUCkHFlBVM%252C_%253BRA9DKM8DJ1bucM%252CzUO50cMzwM52bM%252C_%253B9iEF7ZGmZNUHvM%252C_CeaBxaSDKd9FM%252C_%253BYvBvR3ld5lWTvM%252CNZPjaL6BtLrdwM%252C_%253BYyq0M5VdF0FUBM%252CMDPvSWhwOcWPzM%252C_%253B74EO1BkTKAjRTM%252C6YGYLTGE1BuVMM%252C_%253B7F1Qgw4VQpjxUM%252ChbdRpLYBCtxpzM%252C_%253BaqRgmcTxbHGjvM%252CSIsyVKIDS4mSVM%252C_%253BMv_grMNuMngiRM%252Cs6uQndQalu9gwM%252C_%253BWhz34Ns70Sam4M%252C8pJNRpwZOAYayM%252C_&usg=AI4_-kT_yASkbU7xCWtx-7SQ5th5LpOruw&sa=X&sqi=2&ved=2ahUKEwi92_S6-r_2AhUDxhoKHXCQAisQ9QF6BAggEAE#imgrc=eSVzIEk_N-h10M';
    
    let device = new Device(deviceDetail);
    device.save(function(err) {
        if(err){ cb(err,null); return;}
        console.log('New Device: ' , device);
        devices.push(device);
        cb(null,device);
    });

};

function createDeviceTypes(cb){
    async.series([
        function(callback){
            deviceTypeCreate("C-172P","Cessana","Airplane","SingleEngien","Land",callback);
        },
        function(callback){
            deviceTypeCreate('C-172',"Cessana","Airplane","SingleEngien","Sea",callback);
        }
    ],
    cb );
};

function createDevice(cb){
    async.series([
        function(callback){
            deviceCreate("4X-CGC",deviceTypes[0],"With G1000",true,"IN_SERVICE",null,4500,3459,callback);
        },
        function(callback){
            deviceCreate("4X-XXX",deviceTypes[1],"With G500",true,"IN_SERVICE",null,4500,3459,callback);
        }
    ],
    cb);
};

async.series([
    createMembers,
    createDeviceTypes,
    createDevice
],
function(err,results){
    if(err){
        console.log('FINAL ERR: ', + err );
    }
    else{
        console.log('DEVICES' + devices);
    }
    mongoose.connection.close();
}
);