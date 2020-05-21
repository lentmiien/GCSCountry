// Require used packages
const fs = require('fs');

// Require necessary database models

//---------------------------------------------//
// exports.endpoints = (req, res, next) => {}; //
//---------------------------------------------//

exports.checkall = (req, res, next) => {
  res.locals.role = req.user != undefined ? req.user.role : 'guest';
  next();
};

exports.index = (req, res, next) => {
  res.render('index', {});
};

exports.post = (req, res) => {
  fs.writeFile('./input_data.json', JSON.stringify(req.body), 'utf8', err => {
    console.log(err);
  });
  res.redirect('/');
};
