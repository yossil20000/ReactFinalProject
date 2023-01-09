const Account = require('../Models/account');

const findAccount = async () => {
  const accounts = await Account.find();
  return {accounts};
}
exports.findAccount= findAccount;
