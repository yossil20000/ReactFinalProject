var mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const connectDB = require('./database/db')
var Member = require('./Models/member');
var device = require('./Models/device');
const FlightReservation = require('./Models/flightReservation');
const { rejectSeries } = require('async');
const {DateTime} = require('luxon');
connectDB()
let members= null;
let devices = null;
let reservations = null;
const createReservation = (member,device,date_from,date_to) =>{
    let reservation = new FlightReservation();
    reservation.member = member;
    reservation.device = device;
    reservation.date_from = date_from;
    reservation.date_to = date_to;
    reservation.notification.type = "email";
    reservation.notification.notify = true;
    console.log("date_from", date_from);
    return reservation;
}

const importData = async () => {
  try {
    members = await Member.find();
    devices = await device.find();
    //console.log('Member Data Imported!' , members);
    //console.log('Devices Data Imported!' , devices);
    
    if(members.length > 0 && devices.length > 0)    {
      for(let i=0;i<10;i++)
      {
        let newReservation = createReservation(members[i % 2], devices[i % 2], new Date(2022, 11, 17, i, 30, 0), new Date(2022, 11, 17, i+1, 30, 0));

        await FlightReservation.insertMany(newReservation)
        devices[0].flight_reservs = newReservation;
        members[0].flight_reservs = newReservation;
        await devices[0].save();
        await members[0].save();
      }
      
    }
    process.exit();
    
  } catch (error) {
    console.error(`${error}`)
    process.exit(1)
  }
}


const destroyData = async () => {
  try {
    await Member.deleteMany();
    console.log('Data Destroyed!')
    process.exit()
  } catch (error) {
    console.error(`${error}`)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}
