var express = require('express');
var router = express.Router();

const expenseItemController = require('../Controllers/expenseItemController');
router.get('/',expenseItemController.expense_items);
router.get('/:_id',expenseItemController.expense_item);
router.post('/create' , expenseItemController.expense_item_create);
router.delete('/delete', expenseItemController.expense_item_delete);
router.put("/update",expenseItemController.expense_item_update);
module.exports = router;