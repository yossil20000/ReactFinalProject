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
let mongoose = require('mongoose');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})


var mongoDB = userArgs[0] === undefined ? process.env.MONGODB_TEST_URL : userArgs[0];
//console.log(mongoDB);

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


function flightSummaryCreate(user, flight_summary, cb) {

    Member.findOneAndUpdate({ username: user }, { flights_summary: flight_summary })
        .then((res) => {
            console.log('findOneAndUpdate / res : ', res);
            cb(null, res);
        }).catch((err) => {
            return cb(err, null);
        })
}
function createFlightSummary(cb) {
    async.series([
        function (callback) {
            let flight_summary = [{
                year: "2024",
                total: 5.3
            },
            {
                year: "2023",
                total: 7.9
            },
            {
                year: "2022",
                total: 13
            },
            {
                year: "2021",
                total: 5.3
            },
            {
                year: "2020",
                total: 9.4
            },
            {
                year: "2019",
                total: 9.7
            },
            {
                year: "2018",
                total: 20.6
            },
            {
                year: "2017",
                total: 16.7
            },
            {
                year: "2016",
                total: 9.2
            }
            ]
            flightSummaryCreate("User1000@", flight_summary, callback);
        },
        function (callback) {
            let flight_summary = [{
                year: "2024",
                total: 0
            },
            {
                year: "2023",
                total: 0
            },
            {
                year: "2022",
                total: 11.6
            },
            {
                year: "2021",
                total: 8.4
            },
            {
                year: "2020",
                total: 12.2
            },
            {
                year: "2019",
                total: 9.8
            },
            {
                year: "2018",
                total: 8.8
            },
            {
                year: "2017",
                total: 16.8
            },
            {
                year: "2016",
                total: 4.5
            },
            {
                year: "2015",
                total: 3.3
            },
            {
                year: "2014",
                total: 5.1
            },
            {
                year: "2013",
                total: 6.4
            },
            {
                year: "2012",
                total: 7.7
            }
            ]
            flightSummaryCreate("User2000@", flight_summary, callback);
        },
        function (callback) {
            let flight_summary = [{
                year: "2024",
                total: 5.7
            },
            {
                year: "2023",
                total: 13.2
            },
            {
                year: "2022",
                total: 11.3
            },
            {
                year: "2021",
                total: 6.3
            },
            {
                year: "2020",
                total: 10.4
            },
            {
                year: "2019",
                total: 9.5
            },
            {
                year: "2018",
                total: 10.1
            },
            {
                year: "2017",
                total: 15.9
            },
            {
                year: "2016",
                total: 11.4
            },
            {
                year: "2015",
                total: 9.8
            },
            {
                year: "2014",
                total: 12.4
            },
            {
                year: "2013",
                total: 13.4
            },
            {
                year: "2012",
                total: 16
            }
            ]
            flightSummaryCreate("User3000@", flight_summary, callback);
        },
        function (callback) {
            let flight_summary = [{
                year: "2024",
                total: 0
            },
            {
                year: "2023",
                total: 6.5
            },
            {
                year: "2022",
                total: 8.1
            },
            {
                year: "2021",
                total: 10.7
            },
            {
                year: "2020",
                total: 12
            },
            {
                year: "2019",
                total: 8.9
            },
            {
                year: "2018",
                total: 11.5
            },
            {
                year: "2017",
                total: 8.6
            },
            {
                year: "2016",
                total: 7
            },
            {
                year: "2015",
                total: 4.6
            },
            {
                year: "2014",
                total: 8.7
            },
            {
                year: "2013",
                total: 6.6
            },
            {
                year: "2012",
                total: 6.7
            }
            ]
            flightSummaryCreate("User4000@", flight_summary, callback);
        },
        function (callback) {
            let flight_summary = [{
                year: "2024",
                total: 0.7
            },
            {
                year: "2023",
                total: 4.9
            },
            {
                year: "2022",
                total: 8.4
            },
            {
                year: "2021",
                total: 7.2
            },
            {
                year: "2020",
                total: 8.8
            },
            {
                year: "2019",
                total: 8.4
            },
            {
                year: "2018",
                total: 12
            },
            {
                year: "2017",
                total: 11.6
            },
            {
                year: "2016",
                total: 13.1
            },
            {
                year: "2015",
                total: 2.6
            },
            {
                year: "2014",
                total: 15.4
            },
            {
                year: "2013",
                total: 4.3
            },
            {
                year: "2012",
                total: 11.9
            }
            ]
            flightSummaryCreate("User5000@", flight_summary, callback);
        },
        function (callback) {
            let flight_summary = [{
                year: "2024",
                total: 4.3
            },
            {
                year: "2023",
                total: 18.1
            },
            {
                year: "2022",
                total: 8.8
            },
            {
                year: "2021",
                total: 0
            },
            {
                year: "2020",
                total: 0
            },
            {
                year: "2019",
                total: 0
            },
            {
                year: "2018",
                total: 0
            },
            {
                year: "2017",
                total: 0
            },
            {
                year: "2016",
                total: 0
            },
            {
                year: "2015",
                total: 0
            },
            {
                year: "2014",
                total: 0
            },
            {
                year: "2013",
                total: 0
            },
            {
                year: "2012",
                total: 0
            }
            ]
            flightSummaryCreate("User6000@", flight_summary, callback);
        },
        function (callback) {
            let flight_summary = [{
                year: "2024",
                total: 7.4
            },
            {
                year: "2023",
                total: 10.9
            },
            {
                year: "2022",
                total: 15
            },
            {
                year: "2021",
                total: 16.7
            },
            {
                year: "2020",
                total: 13.6
            },
            {
                year: "2019",
                total: 15.4
            },
            {
                year: "2018",
                total: 14.1
            },
            {
                year: "2017",
                total: 13.1
            },
            {
                year: "2016",
                total: 15.9
            },
            {
                year: "2015",
                total: 10.2
            },
            {
                year: "2014",
                total: 13.2
            },
            {
                year: "2013",
                total: 11.4
            },
            {
                year: "2012",
                total: 11.3
            }
            ]
            flightSummaryCreate("User7000@", flight_summary, callback);
        },
        function (callback) {
            let flight_summary = [{
                year: "2024",
                total: 24.7
            },
            {
                year: "2023",
                total: 20.8
            },
            {
                year: "2022",
                total: 17.4
            },
            {
                year: "2021",
                total: 3.6
            },
            {
                year: "2020",
                total: 14.9
            },
            {
                year: "2019",
                total: 9.6
            },
            {
                year: "2018",
                total: 11.9
            },
            {
                year: "2017",
                total: 14.9
            },
            {
                year: "2016",
                total: 10.7
            },
            {
                year: "2015",
                total: 12.7
            },
            {
                year: "2014",
                total: 20.1
            },
            {
                year: "2013",
                total: 0
            },
            {
                year: "2012",
                total: 0
            }
            ]
            flightSummaryCreate("User8000@", flight_summary, callback);
        },
        function (callback) {
            let flight_summary = [{
                year: "2024",
                total: 2.6
            },
            {
                year: "2023",
                total: 9.4
            },
            {
                year: "2022",
                total: 3.5
            },
            {
                year: "2021",
                total: 8.5
            },
            {
                year: "2020",
                total: 12.3
            },
            {
                year: "2019",
                total: 8.1
            },
            {
                year: "2018",
                total: 9.1
            },
            {
                year: "2017",
                total: 12.5
            },
            {
                year: "2016",
                total: 13.7
            },
            {
                year: "2015",
                total: 6.5
            },
            {
                year: "2014",
                total: 10.7
            },
            {
                year: "2013",
                total: 9.1
            },
            {
                year: "2012",
                total: 10.5
            }
            ]
            flightSummaryCreate("User9000@", flight_summary, callback);
        },
        function (callback) {
            let flight_summary = [{
                year: "2024",
                total: 11.9
            },
            {
                year: "2023",
                total: 4
            },
            {
                year: "2022",
                total: 15.4
            },
            {
                year: "2021",
                total: 14.4
            },
            {
                year: "2020",
                total: 3.5
            },
            {
                year: "2019",
                total: 10.6
            },
            {
                year: "2018",
                total: 11.8
            },
            {
                year: "2017",
                total: 8.8
            },
            {
                year: "2016",
                total: 12.8
            },
            {
                year: "2015",
                total: 9.4
            },
            {
                year: "2014",
                total: 11.1
            },
            {
                year: "2013",
                total: 8.6
            },
            {
                year: "2012",
                total: 10.6
            }
            ]
            flightSummaryCreate("User10000@", flight_summary, callback);
        },
        function (callback) {
            let flight_summary = [{
                year: "2024",
                total: 9.4
            },
            {
                year: "2023",
                total: 15.5
            },
            {
                year: "2022",
                total: 8.8
            },
            {
                year: "2021",
                total: 0
            },
            {
                year: "2020",
                total: 0
            },
            {
                year: "2019",
                total: 0
            },
            {
                year: "2018",
                total: 0
            },
            {
                year: "2017",
                total: 0
            },
            {
                year: "2016",
                total: 0
            },
            {
                year: "2015",
                total: 0
            },
            {
                year: "2014",
                total: 0
            },
            {
                year: "2013",
                total: 0
            },
            {
                year: "2012",
                total: 0
            }
            ]
            flightSummaryCreate("User11000@", flight_summary, callback);
        },
        function (callback) {
            let flight_summary = [{
                year: "2024",
                total: 5.4
            },
            {
                year: "2023",
                total: 9.7
            },
            {
                year: "2022",
                total: 9.2
            },
            {
                year: "2021",
                total: 6.3
            },
            {
                year: "2020",
                total: 11
            },
            {
                year: "2019",
                total: 11.9
            },
            {
                year: "2018",
                total: 11.6
            },
            {
                year: "2017",
                total: 12.4
            },
            {
                year: "2016",
                total: 4.4
            },
            {
                year: "2015",
                total: 0
            },
            {
                year: "2014",
                total: 0
            },
            {
                year: "2013",
                total: 0
            },
            {
                year: "2012",
                total: 0
            }
            ]
            flightSummaryCreate("User12000@", flight_summary, callback);
        },
        function (callback) {
            let flight_summary = [{
                year: "2024",
                total: 2.9
            },
            {
                year: "2023",
                total: 0
            },
            {
                year: "2022",
                total: 0
            },
            {
                year: "2021",
                total: 0
            },
            {
                year: "2020",
                total: 0
            },
            {
                year: "2019",
                total: 0
            },
            {
                year: "2018",
                total: 0
            },
            {
                year: "2017",
                total: 0
            },
            {
                year: "2016",
                total: 0
            },
            {
                year: "2015",
                total: 0
            },
            {
                year: "2014",
                total: 0
            },
            {
                year: "2013",
                total: 0
            },
            {
                year: "2012",
                total: 0
            }
            ]
            flightSummaryCreate("User26000@", flight_summary, callback);
        },
        function (callback) {
            let flight_summary = [{
                year: "2024",
                total: 2
            },
            {
                year: "2023",
                total: 0
            },
            {
                year: "2022",
                total: 0
            },
            {
                year: "2021",
                total: 0
            },
            {
                year: "2020",
                total: 0
            },
            {
                year: "2019",
                total: 0
            },
            {
                year: "2018",
                total: 0
            },
            {
                year: "2017",
                total: 0
            },
            {
                year: "2016",
                total: 0
            },
            {
                year: "2015",
                total: 0
            },
            {
                year: "2014",
                total: 0
            },
            {
                year: "2013",
                total: 0
            },
            {
                year: "2012",
                total: 0
            }
        ]
            flightSummaryCreate("User27000@", flight_summary, callback);
        },
    ],
        cb
    );
}


readline.question(`Do You Want to Delete (YeS)?`, ans => {

    console.log(`Hi ${ans}!`)

    if (ans == 'YeS') {

        /*  dropCollections(); */
        async.series([
            /* createMemberships, */
            createFlightSummary,
            /* createDeviceType,
            createDevice, */
        ],
            // Optional callback
            function (err, results) {
                if (err) {
                    console.log('FINAL ERR: ' + err);
                }
                else {
                    console.log('Fligjt_summary: ');

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



