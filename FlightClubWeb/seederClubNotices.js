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
const {DateTime} = require('luxon');
var async = require('async')
var Member = require('./Models/member');
var ClubNotice = require('./Models/clubNotice');
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
let collections = ["clubnotices"];

let dropCollections = function () {
    //var collections = _.keys(mongoose.connection.collections)
    collections.forEach(collectionName => {
        var collection = mongoose.connection.collections[collectionName]
        console.log(collection);

        collection.drop(function (err) {
            if (err && err.message != 'ns not found') console.log("Drop Done:" + err)
            console.log("Drop Done:" + null)
        })


    })
}
dropCollections();

var clubNotices = [];
function clubNoticeCreate(title, descrition, issue_date,due_date, cb) {

    let clubNoticeDetails = {
        title: title,
        description: descrition,
        issue_date: issue_date,
        due_date: due_date
    };
    let clubNotice = new ClubNotice(clubNoticeDetails);
    clubNotice.save((err) => {
        if (err) {
            return cb(err, null);
        }
        else {
            console.log('New clubNotice: ', clubNotice);
            clubNotices.push(clubNotice);
            cb(null, clubNotice);
        }

    })
}

function createClubNotice(cb) {
    async.series([
        function (callback) {
            clubNoticeCreate("Aircraft 4xcgc","Flapes are not retract", DateTime.now(),new DateTime(2022, 6, 13, { zone: "utc" }),callback);

        },
        function (callback) {
            clubNoticeCreate("Club Open Hours","Sunday - Friday : 07:30 - 18:30",  DateTime.now(),new DateTime(2023, 6, 13, { zone: "utc" }),callback);
            
        },
        function (callback) {
            clubNoticeCreate("Aircraft 4xcgc","Next 50-Hrs on 34440 TACH", DateTime.now(),new DateTime(2022, 6, 13, { zone: "utc" }),callback);
            
        }
       
    ],
        cb
    );
}

readline.question(`Do You Want to Delete (YeS)?`, ans => {

    console.log(`Hi ${ans}!`)

    if (ans == 'YeS') {

        
        async.series([
            createClubNotice
        ],
            // Optional callback
            function (err, results) {
                if (err) {
                    console.log('FINAL ERR: ' + err);
                }
                else {
                    console.log('clubNotices: ' + clubNotices);

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



