const Order = require('../Models/order');

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
  const {member, from,to} = query;
  if(member != undefined)
   filter['member']= member;
  if(from !== undefined){
   filter[`order_date`]= {['$gte'] : new Date(from)};
  }
  if(to !== undefined && to !== "")
  filter[`order_date`]= {...filter[`order_date`],['$lte'] : new Date(to)};
  console.log("parseQuery/query,filter",query,filter);
  return filter;
}