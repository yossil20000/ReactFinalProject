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

const importData = async (save) => {
  try {
    members = await Member.find();
    devices = await device.find();
    //console.log('Member Data Imported!' , members);
    //console.log('Devices Data Imported!' , devices);
    
    if(members.length > 0 && devices.length > 0)    {
      for(let i=0;i<5;i++)
      {
        let member_id = i % 3;
        let device_id = i % 2;
        console.log("member_id", member_id ,"device_id",device_id )

        let newReservation = createReservation(members[Number(member_id)], devices[Number(device_id)], new Date(), new Date(2022, 12, 17, i+1, 30, 0));

        console.log("reservation", (newReservation.date_from.getFullYear()));
        if(save)
        {
          await FlightReservation.insertMany(newReservation)
          // console.log('Member Data Imported!' , members[member_id]);
           devices[Number(device_id)].flight_reservs = newReservation;
           members[Number(member_id)].flight_reservs = newReservation;
           await devices[Number(device_id)].save();
           await members[Number(member_id)].save();
   
        }
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
} else if (process.argv[2] === '-s') {
  console.log("Demo")
  importData(true)
}
else{
  importData(false);
}
