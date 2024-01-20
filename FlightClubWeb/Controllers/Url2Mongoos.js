function getFlightQuery(query) {

  let filter={...query}
  filter["date"] = getDateQuery(query).date;
  delete filter['from']
  delete filter['to']
  return filter
}

function getDateQuery(query) {
  let from = new Date(query.from);
  let to = new Date(query.to);
  let filter={};
  if(isNaN(from) == false && isNaN(to) == false){
    filter["date"] =  { $gte: from, $lte: to } ;
  }
  else if(isNaN(from) == false){
    filter["date"] =  { $gte: from } ;
  }
  else if (isNaN(to) == false){
    filter["date"] =  { $lte: to } ;
  }
  return filter;
}
module.exports = {
  getFlightQuery,
  getDateQuery
 }