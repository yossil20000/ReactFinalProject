require("../Types/date.extensions");
const {convertDecimal128ArrayToNumbers} = require('../Utils/mongooseTypeConverter');
const FlightReservation = require("../Models/flightReservation");
const timeOffsetTOtimeZone = (timeOffset) => {
  const timeOffsetInHours = timeOffset / 60;
  const hours = Math.floor(timeOffsetInHours);
  const minutes = Math.round((timeOffsetInHours - hours) * 60);
  const sign = hours >= 0 ? "+" : "-";
  const absoluteHours = Math.abs(hours).toString().padStart(2, "0");
  const absoluteMinutes = Math.abs(minutes).toString().padStart(2, "0");
  return `${sign}${absoluteHours}:${absoluteMinutes}`;
};
const findOverlapping = async (device, timeFromRef, timeToRef, timeOffset) => {
  let timeStart = timeFromRef - 2 * 36000000;
  let timeEnd = timeToRef + 2 * 36000000;
  try {
    const found = await FlightReservation.find({
      $and: [
        { device: device },
        {
          /* date_from: { "$lte": new Date(newReservation._doc.date_to) }, date_to: { "$gte": new Date(newReservation._doc.date_from) } */
  
          $or: [
            { time_from: { $lte: timeStart }, time_to: { $gte: timeEnd } },
            { time_from: { $lte: timeEnd }, time_to: { $gte: timeStart } },
          ],
        },
      ],
    }).exec();
    console.log("found", found);
    timeStart = timeFromRef - timeOffset * 60000;
    timeEnd = timeToRef - timeOffset * 60000;
    let localDateFound = undefined;
    found.forEach((item) => {
      const i = item.toJSON
      itemTimeOffset = item.timeOffset;
      const itemStart = item.time_from - itemTimeOffset * 60000;
      const itemEnd = item.time_to - itemTimeOffset * 60000;
      if (
        (itemStart <= timeStart && itemEnd >= timeStart) ||
        (itemStart <= timeEnd && itemEnd >= timeEnd)
      ) {
        localDateFound = item;
        console.log("item", item);
         
      }
    });
    
    return localDateFound;
  }
  catch (errors) {
    throw(errors)
  }
 
  /* const findOverlapping =  (dateStart, dateEnd)   => {
  FlightReservation.aggregate([
    {
      
      $addFields: {
        
        "utcStartDate": {
          $dateFromString: {
            dateString: "$date_from",
            timeZone: "America/New_York"
          }
        },
        "utcEndDate": {
          $dateFromString: {
            dateString: "$date_to",
            timeZone: "America/New_York"
          }
        }
      }
    } ,
    {
      $match: {
        $or: [
          { "utcStartDate": { $lt: ISODate("2025-04-20T11:00:00Z") }, "utcEndDate": { $gt: ISODate("2025-04-20T14:00:00Z") } },
          { "utcStartDate": { $lt: ISODate("2025-04-20T14:00:00Z") }, "utcEndDate": { $gt: ISODate("2025-04-20T11:00:00Z") } }
        ]
      }
    } 
  ])
  .then((results) => {
    console.log("Overlapping reservations found:", results);
    return results;
  }). 
  catch((error) => {
    console.error("Error finding overlapping reservations:", error);
    throw error;
  });*/
};

module.exports = {
  findOverlapping: findOverlapping,
};
