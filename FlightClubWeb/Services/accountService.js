const {Account} = require('../Models/account');

const findAccount = async (query) => {
  const accounts = await Account.find(query).populate([
    {path: "member", model: "Member", select: "_id member_id first_name family_name member_type"},
    {path: "transactions",populate:[{path: "order",model:"Order"}]}] );
  return {accounts};
}
exports.findAccount= findAccount;
