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
var UpLoadedImag = require('./Models/upLoadedPhoto');
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
let collections = ["uploadedimags"];

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

var members = []
var upLoadedPhotos = [];
members = Member.find()
.sort([['family_name','ascending']])
.exec(function(err,list_members){
    if(err){ return ;}
    return list_members;
});
console.log("Members", members)
function loadPhotoCreate(title, descrition, member_id, cb) {

    let photoDetails = {
        title: title,
        description: descrition
    };
    let loadedPhotho = new UpLoadedImag(photoDetails);
    loadedPhotho.save((err) => {
        if (err) {
            return cb(err, null);
        }
        else {
            console.log('New membership: ', loadedPhotho);
            upLoadedPhotos.push(loadedPhotho);
            cb(null, loadedPhotho);
        }

    })
}

function createPhoto(cb) {
    async.series([
        function (callback) {
            loadPhotoCreate("Yoss","Test Photo","",callback);
        }
       
    ],
        cb
    );
}

readline.question(`Do You Want to Delete (YeS)?`, ans => {

    console.log(`Hi ${ans}!`)

    if (ans == 'YeS') {

        
        async.series([
            createPhoto
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



