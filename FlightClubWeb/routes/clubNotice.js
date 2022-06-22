var express = require('express');
var router = express.Router();

const clubNoticeController = require('../Controllers/clubNoticeController');

router.get('/',clubNoticeController.club_notice_list);
router.get('/notice/:_id',clubNoticeController.club_notice_list);

module.exports = router; 