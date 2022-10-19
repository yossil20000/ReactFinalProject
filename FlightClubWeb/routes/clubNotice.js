var express = require('express');
var router = express.Router();

const clubNoticeController = require('../Controllers/clubNoticeController');
const clubNotice = require('../Models/clubNotice');

router.get('/',clubNoticeController.notice_list);
router.get('/:_id',clubNoticeController.notice);
router.post('/create' , clubNoticeController.notice_create);
router.delete('/delete', clubNoticeController.notice_delete);
router.put("/update",clubNoticeController.notice_update); 

module.exports = router; 