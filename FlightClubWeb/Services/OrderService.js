const Order = require('../Models/order');

const findOrders = async (query) => {
  const orders = await Order.find(query)
  .populate({path: 'member',populate: {path: 'membership'}})
  .exec();
  return {orders};
}
exports.findOrders= findOrders;