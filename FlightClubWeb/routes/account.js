var express = require('express');
var router = express.Router();
const authJWT = require('../middleware/authJWT');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../Models/constants');
const accountController = require('../Controllers/accountController');


router.get('/',accountController.account_list);
router.get('/:_id',accountController.account);
router.post('/combo',[authJWT.authenticate],  accountController.combo);
router.post('/create' , accountController.account_create);
router.delete('/delete', accountController.account_delete);
router.put("/update",accountController.account_update); 
router.put('/status',[authJWT.authenticate, authorize.authorize([ROLES[4]])] ,accountController.account_status);
module.exports = router; 