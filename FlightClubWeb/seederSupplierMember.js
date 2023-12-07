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
const Membership = require('./Models/membership');
var DeviceType = require('./Models/deviceType')
var Device = require('./Models/device')
var Role = require('./Models/role');
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
let collections = ["devicetypes",'members','devices',"Memberships"];

let dropCollections = function() {
    //var collections = _.keys(mongoose.connection.collections)
    collections.forEach( collectionName => {
      var collection = mongoose.connection.collections[collectionName]
        console.log("Collection",collectionName,collection);
      collection?.drop(function(err) {
        if (err && err.message != 'ns not found') console.log("Drop Done:" +err)
        console.log("Drop Done:" +null)
      })
    })
  } 


const devices = []
var members = []
var deviceTypes = [];
const memberships = [];
function membershipCreate(entry_price,rank,cb){
   
    let detail = {
        entry_price: entry_price,
        rank: rank
    }
    let membership = new Membership(detail);
    membership.save((err) => {
        if(err){
            return cb(err,null);
        }
        else{
            console.log('New membership: ' , membership);
            memberships.push(membership);
            cb(null,membership);
        }

    }) 
}
function deviceCreate(device_id,device_type,available,device_status,due_date,hobbs_meter, engien_meter, cb){
    let deviceDetail = {
        device_id: device_id,
        device_type: device_type,
        available: available,
        device_status: device_status,
        due_date: due_date,
        hobbs_meter: hobbs_meter,
        engien_meter: engien_meter,
        price: {base: 420.4,meter: "ENGIEN"},
        maintanance: {next_meter: 5670.6},
        description: "Good Aircrapt",
        details: {
            image:  'https://www.google.com/search?q=airplane+images&sxsrf=APq-WBtm62ecKiz4huAVdDnYbGDgBYIrLw:1647066931349&tbm=isch&source=iu&ictx=1&vet=1&fir=dJ-ns3zOOG2WjM%252C8pJNRpwZOAYayM%252C_%253BeSVzIEk_N-h10M%252CWITfi61mVOl_gM%252C_%253BK8fp99P4ei9q5M%252CfdhhcUCkHFlBVM%252C_%253BRA9DKM8DJ1bucM%252CzUO50cMzwM52bM%252C_%253B9iEF7ZGmZNUHvM%252C_CeaBxaSDKd9FM%252C_%253BYvBvR3ld5lWTvM%252CNZPjaL6BtLrdwM%252C_%253BYyq0M5VdF0FUBM%252CMDPvSWhwOcWPzM%252C_%253B74EO1BkTKAjRTM%252C6YGYLTGE1BuVMM%252C_%253B7F1Qgw4VQpjxUM%252ChbdRpLYBCtxpzM%252C_%253BaqRgmcTxbHGjvM%252CSIsyVKIDS4mSVM%252C_%253BMv_grMNuMngiRM%252Cs6uQndQalu9gwM%252C_%253BWhz34Ns70Sam4M%252C8pJNRpwZOAYayM%252C_&usg=AI4_-kT_yASkbU7xCWtx-7SQ5th5LpOruw&sa=X&sqi=2&ved=2ahUKEwi92_S6-r_2AhUDxhoKHXCQAisQ9QF6BAggEAE#imgrc=eSVzIEk_N-h10M',
            color: 'Red/White',
            seats: 4,
            fuel: {quantity : 50},
            instruments:['VFR','G1000']
        }
    
        
    }
    
    let device = new Device(deviceDetail);
    device.save(function(err) {
        if(err){ cb(err,null); return;}
        console.log('New Device: ' , device);
        devices.push(device);
        cb(null,device);
    });

};
function createDevice(cb){
    async.series([
        function(callback){
            deviceCreate("4X-CGC",deviceTypes[0],true,"IN_SERVICE",null,0,0,callback);
        },
        function(callback){
            deviceCreate("4X-XXX",deviceTypes[1],true,"IN_SERVICE",null,0,0,callback);
        }
    ],
    cb);
};
const address = {
    line1: "interna box 248",
    line2: "",
    city: "Gilon",
    postcode: "2010300",
    province: "Misgav",
    state: "ISRAEL"
}
/* const roles = new Role({
    roles: [CE.ROLES[2], CE.ROLES[4]]
}); */
function memberCreate(first_name, family_name, d_birth, d_join, memberId,email,password,membership,roles,username,member_type ,cb) {
   
    memberdetail = { username: username,first_name: first_name, family_name: family_name, member_id: memberId ,
        contact:{
            email: email,
            phone:{number: "9050740"},
            billing_address: address,
            shipping_address: address

        },
        role: roles,
        password: password,
        membership: membership,
        member_type:member_type
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
function createMemberships(cb){
    async.series([
        function(callback){
            membershipCreate(21000,"Silver",callback);
        },
        function(callback){
            membershipCreate(22000,"Gold",callback);
        }
    ],cb
    );
}

function createMembers(cb) {
    async.series([
        function (callback) {
            const roles = new Role({
                roles: [CE.ROLES[0]]
            })
            memberCreate("Leumi", "Bank", "1965-08-21", "2011-11-01", "000015000","yos.1965@gmail.com", "Pass15000@","63f3b0dafef004dc9f10d53e",roles,"User15000@","Supplier", callback);
        },
        function (callback) {
            const roles = new Role({
                roles: [CE.ROLES[0]]
            })
            memberCreate("Megido", "Airport", "1965-08-21", "2011-11-01", "000016000","yos.1965@gmail.com", "Pass16000@","63f3b0dafef004dc9f10d53e",roles,"User16000@","Supplier", callback);
        },
        function (callback) {
            const roles = new Role({
                roles: [CE.ROLES[0]]
            })
            memberCreate("Yeuda", "Carmely", "1965-08-21", "2011-11-01", "000017000","yos.1965@gmail.com", "Pass17000@","63f3b0dafef004dc9f10d53e",roles,"User17000@","Supplier", callback);
        },
        function (callback) {
            const roles = new Role({
                roles: [CE.ROLES[0]]
            })
            memberCreate("Paz", "Fuel", "1965-08-21", "2011-11-01", "000018000","yos.1965@gmail.com", "Pass18000@","63f3b0dafef004dc9f10d53e",roles,"User18000@","Supplier", callback);
        },
        function (callback) {
            const roles = new Role({
                roles: [CE.ROLES[0]]
            })
            memberCreate("CAAI", "GOV", "1965-08-21", "2011-11-01", "000019000","yos.1965@gmail.com", "Pass19000@","63f3b0dafef004dc9f10d53e",roles,"User19000@","Supplier", callback);
        },
        function (callback) {
            const roles = new Role({
                roles: [CE.ROLES[0]]
            })
            memberCreate("Menora", "Insurance", "1965-08-21", "2011-11-01", "000020000","yos.1965@gmail.com", "Pass20000@","63f3b0dafef004dc9f10d53e",roles,"User20000@","Supplier", callback);
        },
        function (callback) {
            const roles = new Role({
                roles: [CE.ROLES[0]]
            })
            memberCreate("Hameshapetz", "Fixer", "1965-08-21", "2011-11-01", "000021000","yos.1965@gmail.com", "Pass21000@","63f3b0dafef004dc9f10d53e",roles,"User21000@","Supplier", callback);
        },
        function (callback) {
            const roles = new Role({
                roles: [CE.ROLES[0]]
            })
            memberCreate("Laipair", "Utils", "1965-08-21", "2011-11-01", "000022000","yos.1965@gmail.com", "Pass22000@","63f3b0dafef004dc9f10d53e",roles,"User22000@","Supplier", callback);
        },
        function (callback) {
            const roles = new Role({
                roles: [CE.ROLES[0]]
            })
            memberCreate("FNA", "Garage", "1965-08-21", "2011-11-01", "000023000","yos.1965@gmail.com", "Pass23000@","63f3b0dafef004dc9f10d53e",roles,"User23000@","Supplier", callback);
        },
        function (callback) {
            const roles = new Role({
                roles: [CE.ROLES[0]]
            })
            memberCreate("Alon", "Golomb", "1965-08-21", "2011-11-01", "000024000","yos.1965@gmail.com", "Pass24000@","63f3b0dafef004dc9f10d53e",roles,"User24000@","Supplier", callback);
        },
        function (callback) {
            const roles = new Role({
                roles: [CE.ROLES[0]]
            })
            memberCreate("SPD_Hosting", "Internet", "1965-08-21", "2011-11-01", "000025000","yos.1965@gmail.com", "Pass25000@","63f3b0dafef004dc9f10d53e",roles,"User25000@","Supplier", callback);
        }


    ],
        cb
    );
}

function deviceTypeCreate(name, type, descrition, cb) {
    let deviceTypeDetailes = { 
        name: name,
        type: type,
        class:{
            engien: "SingleEngien",
            surface: "Land"
        },
        description: descrition };
    let deviceType = new DeviceType(deviceTypeDetailes);
    deviceType.save(function (err) {
        if (err) {
            cb(err);
            return;
        }
        console.log(`New Device Type: ${deviceType}`);
        deviceTypes.push(deviceType);
        cb(null, deviceType);
    });
}

function createDeviceType(cb){
    async.series([
        function(callback){
            deviceTypeCreate("C-172P", "Airplane","Cessna",callback);
        }
    ],
    cb
    );
}


readline.question(`Do You Want to Delete (YeS)?`, ans => {
    
    console.log(`Hi ${ans}!`)

    if(ans == 'YeS'){
        
       /*  dropCollections(); */
        async.series([
            /* createMemberships, */
            createMembers,
            /* createDeviceType,
            createDevice, */
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
    else
    {
        throw "Exit";
    }
    readline.close();
  });



