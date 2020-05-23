// Require used packages

// Require necessary database models
const temp_db = require('../input_data.json');
const { Country, Countrylist, Tracking, Op } = require('../sequelize');

//---------------------------------------------//
// exports.endpoints = (req, res, next) => {}; //
//---------------------------------------------//

exports.mypage = (req, res, next) => {
  Country.findAll().then((results) => {
    res.render('mypage', { countries: results });
  });
};

exports.update_page = (req, res) => {
  Country.findAll().then((results) => {
    res.render('update', { countries: results });
  });
};
exports.update_value = (req, res) => {
  let status = 'FAILED';
  for (let i = 0; i < temp_db.length; i++) {
    if (temp_db[i].code == req.body.code) {
      temp_db[i][req.body.method].available = req.body.status;
      status = 'OK';
    }
  }
  res.json({ status });
};
