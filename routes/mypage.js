// Require used packages
var express = require('express');
var router = express.Router();

// Require controller modules
var controller = require('../controllers/mypageController');

//-------------------------------------------//
// router.method(path, controller.endpoint); //
//-------------------------------------------//

router.get('/', controller.mypage);

// Export router
module.exports = router;
