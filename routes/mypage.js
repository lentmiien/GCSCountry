// Require used packages
var express = require('express');
var router = express.Router();

// Require controller modules
var controller = require('../controllers/mypageController');

//-------------------------------------------//
// router.method(path, controller.endpoint); //
//-------------------------------------------//

router.get('/', controller.mypage);

router.get('/update', controller.update_page);
router.post('/update', controller.update_value);

router.get('/recalculate', controller.recalculate);

// Export router
module.exports = router;
