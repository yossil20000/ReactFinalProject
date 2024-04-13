const Expense = require('../Models/expense');
const { Transaction, TransactionSchema } = require('../Models/transaction');
const ClubAccount = require('../Models/clubAccount')
async function expensedb_fix(find, replace) {

  Expense.find({
    $or: [{ "destination.account_id": { "$regex": find } }, { "source.account_id": { "$regex": find } }]
  }).lean().exec()
    .then((res) => {
      console.log('expense_update / res : ', res, res.length);
      const res1 = res.map((i) => {
        return {
          _id: i._id,
          destination: {
            account_id: i.destination.account_id.replaceAll(find, replace),
            display: i.destination.display.replaceAll(find, replace)
          },
          source: {
            account_id: i.source.account_id.replaceAll(find, replace),
            display: i.source.display.replaceAll(find, replace)
          }
        }
      })

      console.log('expense_update /replae : ', res1, res1.length);
      for (let i = 0; i < res1.length; i++) {
        console.log('expense_update / res.forEach : ', i);
        const id = res1[i]._id
        delete res1[i]._id
        const updated = Expense.findByIdAndUpdate(id, res1[i]).then((res) => {
          console.log('expense_update / res.forEach : ', res);
        }

        ).catch((err) => {
          console.log('expense_update / err : ', err);
          return err;
        })
      }
      /*       res.forEach((i) => {
                console.log('expense_update / res.forEach : ', i);
                const id= i._id
                delete i._id
                const updated = Expense.updateOne({id: id},i).then((res) => {
                    console.log('expense_update / res.forEach : ', res);
                }
      
                ).catch((err) => {
                    console.log('expense_update / err : ', err);
                    return err;
                })
            }) */
      return ""
    }).catch((err) => {
      return err;
    })
}
async function transactiondb_fix(find, replace) {

  Transaction.find({
    $or: [{ "destination": { "$regex": find } }, { "source": { "$regex": find } }]
  }).lean().exec()
    .then((res) => {
      console.log('transaction_update / res : ', res, res.length);
      const res1 = res.map((i) => {
        return {
          _id: i._id,
          destination: i.destination.replaceAll(find, replace),
          source: i.source.replaceAll(find, replace),
          amount: i.amount,
          source_balance: i.source_balance,
          destination_balance: i.destination_balance,
          order: i.order,
          type: i.type,
          calculation_type: i.calculation_type,
          payment: i.payment,
          description: i.description,
          date: i.date
        }
      })
      console.log('Transaction_update /replae : ', res1, res1.length);
      for (let i = 0; i < res1.length; i++) {
        console.log('Transaction_update / res.forEach : ', i);
        const id = res1[i]._id
        delete res1[i]._id
        const updated = Transaction.findByIdAndUpdate(id, res1[i]).then((res) => {
          console.log('Transaction_update / res.forEach : ', res);
        }

        ).catch((err) => {
          console.log('Transaction_update / err : ', err);
          return err;
        })
      }
      /*       res.forEach((i) => {
                console.log('expense_update / res.forEach : ', i);
                const id= i._id
                delete i._id
                const updated = Expense.updateOne({id: id},i).then((res) => {
                    console.log('expense_update / res.forEach : ', res);
                }
      
                ).catch((err) => {
                    console.log('expense_update / err : ', err);
                    return err;
                })
            }) */
      return ""
    }).catch((err) => {
      return err;
    })
}

async function accountsTransactionb_fix(find, replace) {

  ClubAccount.find().populate("transactions").select("transactions").exec()
    .then((res) => {
      console.log('expense_update / res : ', JSON.stringify(res[0]._doc.transactions, null, 2), res.length);

      const transacations = JSON.parse(JSON.stringify(res[0]._doc.transactions, null, 2))
      const transacationsConvert = transacations.map((i) => {
        
        i.destination= i.destination.replaceAll(find,replace),
        i.source = i.source.replaceAll(find,replace)
        return i
      })
      /* transacationsConvert["_id"] = res[0]._doc._id; */
      console.log('expense_update /replae : ', transacationsConvert, transacationsConvert.length);
      
      const updated = ClubAccount.findByIdAndUpdate(res[0],{transactions: transacationsConvert }).then((res) => {
        console.log('expense_update / res.forEach : ', res);
      }).catch((err) => {

      })
      /*        for(let i=0; i< res1.length ;i++){
              console.log('expense_update / res.forEach : ', i);
                const id= res1[i]._id
                delete res1[i]._id
                const updated = ClubAccount.findByIdAndUpdate(id,res1[i]).then((res) => {
                    console.log('expense_update / res.forEach : ', res);
                }
      
                ).catch((err) => {
                    console.log('expense_update / err : ', err);
                    return err;
                })
            }   */
      /*       res.forEach((i) => {
                console.log('expense_update / res.forEach : ', i);
                const id= i._id
                delete i._id
                const updated = Expense.updateOne({id: id},i).then((res) => {
                    console.log('expense_update / res.forEach : ', res);
                }
      
                ).catch((err) => {
                    console.log('expense_update / err : ', err);
                    return err;
                })
            }) */
      return ""
    }).catch((err) => {
      return err;
    })
}

async function expensedb_fix_save(find, replace) {

  Expense.find({
    $or: [{ "destination.account_id": { "$regex": find } }, { "source.account_id": { "$regex": find } }]
  }).lean().array.forEach(element => {
    console.log(element)
  }).exec()
    .then((res) => {
      console.log('expense_update / res : ', res, res.length);
      res = res.map((i) => {
        i.destination.account_id = i.destination.account_id.replaceAll(find, replace)
        i.destination.display = i.destination.display.replaceAll(find, replace);
        i.source.account_id = i.source.account_id.replaceAll(find, replace)
        i.source.display = i.source.display.replaceAll(find, replace)
          ;
        i.save()
      })

      console.log('expense_update /replae : ', res, res.length);
      res.forEach((i) => {
        console.log('expense_update / res.forEach : ', i);
        const id = i._id
        delete i._id
        const updated = Expense.updateOne({ id: id }, i).then((res) => {
          console.log('expense_update / res.forEach : ', res);
        }

        ).catch((err) => {
          console.log('expense_update / err : ', err);
          return err;
        })
      })
      return ""
    }).catch((err) => {
      return err;
    })
}
exports.expensedb_fix = expensedb_fix
exports.transactiondb_fix = transactiondb_fix
exports.accountsTransactionb_fix = accountsTransactionb_fix