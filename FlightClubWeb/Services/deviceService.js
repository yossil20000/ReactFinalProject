const Device = require('../Models/device');

const findDevice = async (query) => {
  const device = await Device.findOne(query)
  return device.toJSON();
}
exports.findDevice= findDevice;