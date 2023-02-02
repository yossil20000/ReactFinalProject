const {Account} = require('../Models/account');

const findAccount = async (query) => {
  const accounts = await Account.find(query).populate([
    {path: "member", select: "_id member_id first_name family_name"},
    {path: "transactions",select: "source amount" }
] );
  return {accounts};
}
exports.findAccount= findAccount;
