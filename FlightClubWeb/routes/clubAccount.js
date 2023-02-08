var express = require('express');
var router = express.Router();
const authJWT = require('../middleware/authJWT');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../Models/constants');
const clubAccountController = require('../Controllers/clubAccountController');

router.get("/",clubAccountController.club); 
router.patch("/expense", clubAccountController.list_expense)
router.put("/create_expense",clubAccountController.create_expense);
router.post("/update_expense",clubAccountController.update_expense);
router.put("/add_account",clubAccountController.add_account); 
router.post('/combo',[authJWT.authenticate],  clubAccountController.combo);
router.put('/add_transaction',clubAccountController.add_transaction);
module.exports = router;