var express = require('express');
var router = express.Router();
const authJWT = require('../middleware/authJWT');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../Models/constants');
const clubAccountController = require('../Controllers/clubAccountController');

router.get("/:include_accounts",clubAccountController.club); 
router.get("/",clubAccountController.club); 
router.patch("/expense", clubAccountController.list_expense)
router.put("/create_expense",clubAccountController.create_expense);
router.post("/update_expense",clubAccountController.update_expense);
router.put("/add_account",clubAccountController.add_account); 
router.post('/combo',[authJWT.authenticate],  clubAccountController.combo);
router.put('/add_order_transaction',clubAccountController.add_order_transaction);
router.put('/add_transaction',clubAccountController.add_transaction);
router.put('/add_transaction_type',clubAccountController.add_transaction_Type);
router.put('/add_transaction_payment',clubAccountController.add_transaction_payment);
router.delete('/delete_expense/:_id',clubAccountController.delete_expense);
router.get('/transaction/search',clubAccountController.list_transaction);
router.get('/convert/search',clubAccountController.convert_transaction);
router.get('/expanse/fix',clubAccountController.expense_fix)
router.get('/club/account_dump',clubAccountController.dump_club_account);
router.get('/club/account_saving',clubAccountController.list_account_saving);
router.post('/club/account_saving',clubAccountController.account_saving_update)
router.get('/club/account_transaction/fix_date',clubAccountController.account_transaction_fix_date)
module.exports = router;