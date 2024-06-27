#! /usr/bin/env node
require('dotenv').config()
let mongoose = require('mongoose');
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
var Expense = require('./Models/expense')

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


function expense_update(find,replace,cb){
   
    Expense.find({
       $or: [{ "destination.account_id": {"$regex": find } },{"source.account_id": {"$regex": find } }]}).lean().exec()
    .then((res) => {
        console.log('expense_update / res : ', res, res.length);
         res = res.map((i) => {
            i.destination.account_id = i.destination.account_id.replaceAll(find,replace) 
            i.destination.display = i.destination.display.replaceAll(find,replace);
            i.source.account_id = i.source.account_id.replaceAll(find,replace)
            i.source.display = i.source.display.replaceAll(find,replace) 
            ; return i} )

        console.log('expense_update /replae : ', res, res.length);
        res.forEach((i) => {
            console.log('expense_update / res.forEach : ', i);
            const id= i._id
            delete i._id
            const updated = Expense.findOneAndUpdate({id: id}, {destination: {display: i.destination.display,account_id: i.destination.account_id}}).then((res) => {
                console.log('expense_update / res.forEach : ', res);
            }

            ).catch((err) => {
                console.log('expense_update / err : ', err);
            })
        })
/*         Expense.updateMany({},res).exec().then((res) => {
            console.log('expense_update / save : ', res);
        }).catch((err) => {
            return cb(err, null);
        }) */
        cb(null, res);
    }).catch((err) => {
        return cb(err, null);
    })
}
function expenseUpdate(cb) {
    async.series([
        function (callback) {   
            expense_update("059828392", "000005000", callback);
        }

    ],
        cb
    );
}


readline.question(`Do You Want to Delete (YeS)?`, ans => {
    
    console.log(`Hi ${ans}!`)

    if(ans == 'YeS'){
        
       /*  dropCollections(); */

            expense_update("059828392", "000005000", () => 
            {
                console.log("expense_update")});
            console.log('expense_update / save : ');
    }
    else
    {
        throw "Exit";
    }
    readline.close();
  });



