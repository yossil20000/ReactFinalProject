var express = require('express');
var router = express.Router();
const authJWT = require('../middleware/authJWT');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../Models/constants');
const clubAccountController = require('../Controllers/clubAccountController');

router.get("/",clubAccountController.club); 
router.put("/add_account",clubAccountController.add_account); 

module.exports = router;