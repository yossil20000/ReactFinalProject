var express = require('express');
var router = express.Router();
const authJWT = require('../middleware/authJWT');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../Models/constants');
const accountController = require('../Controllers/accountController');


router.get('/',[authJWT.authenticate],accountController.account_list);
router.get('/:_id',[authJWT.authenticate],accountController.account);
router.get('/search/filter',[authJWT.authenticate] , accountController.account_search);
router.post('/combo',[authJWT.authenticate],  accountController.combo);
router.post('/create' , [authJWT.authenticate, authorize.authorize([ROLES[4] , ROLES[5]])] , accountController.account_create);
router.delete('/delete', [authJWT.authenticate, authorize.authorize([ROLES[4] , ROLES[5]])] , accountController.account_delete);
router.put("/update",[authJWT.authenticate, authorize.authorize([ROLES[4] , ROLES[5]])], accountController.account_update); 
router.put('/status',[authJWT.authenticate, authorize.authorize([ROLES[4] , ROLES[5]])] ,accountController.account_status);
module.exports = router; 