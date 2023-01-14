const Flight = require('../Models/flight');

const findFlights = async (query) => {
  const flights = await Flight.find(query).populate({path: "member device"});
  return {flights};
}
exports.findFlights= findFlights;