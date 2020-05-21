// Require used packages

// Require necessary database models
const temp_db = require('../input_data.json');

//---------------------------------------------//
// exports.endpoints = (req, res, next) => {}; //
//---------------------------------------------//

exports.mypage = (req, res, next) => {
  res.render('mypage', { countries: temp_db });
};
