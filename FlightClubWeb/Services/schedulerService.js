const Device = require('../Models/device')


function findDeviceNextService (query)  {
  if(query.device_id == undefined)
    query.device_id = "4XCGC"
  const device =  Device.findOne({"device_id": query.device_id})
  .exec()
  return {device}
}
exports.findDeviceNextService = findDeviceNextService;