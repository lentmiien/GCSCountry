// Require used packages
var express = require('express');
var router = express.Router();

// Require controller modules
var controller = require('../controllers/indexController');

//-------------------------------------------//
// router.method(path, controller.endpoint); //
//-------------------------------------------//

router.all('*', controller.checkall);

router.get('/', controller.index);

router.post('/post', controller.post);

// Export router
module.exports = router;
