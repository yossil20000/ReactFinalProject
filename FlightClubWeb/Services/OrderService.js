const Order = require('../Models/order');
const log = require('debug-level').log('orderService');
const findOrders = async (query) => {
  const filter = parseQuery(query)
  const orders = await Order.find(filter)
  .populate({path: 'member',populate: {path: 'membership'}})
  .exec();
  return {orders};
}
exports.findOrders= findOrders;

function parseQuery(query) {
  let filter = {}
  const {member, from,to,orderStatus} = query;
  
  if(member != undefined)
   filter['member']= member;
  if(from !== undefined){
   filter[`order_date`]= {['$gte'] : new Date(from)};
  }
  if(to !== undefined && to !== "")
  filter[`order_date`]= {...filter[`order_date`],['$lte'] : new Date(to)};
  
  log.info("parseQuery/query,filter",query,filter);
  return filter;
}