const Flight = require('../Models/flight');

const findFlights = async (query) => {
  const flights = await Flight.find(query)
  .populate({path: "device"})
  .populate({path: 'member',populate: {path: 'membership'}});
  return {flights};
}
exports.findFlights= findFlights;