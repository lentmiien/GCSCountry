// Require used packages
const fs = require('fs');

// Require necessary database models
const { Country } = require('../sequelize');

//---------------------------------------------//
// exports.endpoints = (req, res, next) => {}; //
//---------------------------------------------//

exports.checkall = (req, res, next) => {
  res.locals.role = req.user != undefined ? req.user.role : 'guest';
  next();
};

exports.index = async (req, res, next) => {
  const delay_ranking = [];

  // Only calculate ranking if a logged in user
  if (req.user) {
    const cdata = await Country.findAll();
    cdata.forEach((data) => {
      if (data.ems_averagetime > 0) {
        delay_ranking.push({
          country: data.country_name,
          method: 'EMS',
          delay: Math.round((100 * data.ems_averagetime) / data.ems_totalaveragetime) / 100,
          small_sample: data.ems_small_sample,
        });
      }
      if (data.airsp_averagetime > 0) {
        delay_ranking.push({
          country: data.country_name,
          method: 'ASP',
          delay: Math.round((100 * data.airsp_averagetime) / data.airsp_totalaveragetime) / 100,
          small_sample: data.airsp_small_sample,
        });
      }
      if (data.salspr_averagetime > 0) {
        delay_ranking.push({
          country: data.country_name,
          method: 'SAL Reg.',
          delay: Math.round((100 * data.salspr_averagetime) / data.salspr_totalaveragetime) / 100,
          small_sample: data.salspr_small_sample,
        });
      }
      if (data.salp_averagetime > 0) {
        delay_ranking.push({
          country: data.country_name,
          method: 'SAL Parcel',
          delay: Math.round((100 * data.salp_averagetime) / data.salp_totalaveragetime) / 100,
          small_sample: data.salp_small_sample,
        });
      }
      if (data.dhl_averagetime > 0) {
        delay_ranking.push({
          country: data.country_name,
          method: 'DHL',
          delay: Math.round((100 * data.dhl_averagetime) / data.dhl_totalaveragetime) / 100,
          small_sample: data.dhl_small_sample,
        });
      }
      if (data.airp_averagetime > 0) {
        delay_ranking.push({
          country: data.country_name,
          method: 'Air Parcel',
          delay: Math.round((100 * data.airp_averagetime) / data.airp_totalaveragetime) / 100,
          small_sample: data.airp_small_sample,
        });
      }
    });
  }

  // Sort by delay value
  delay_ranking.sort((a, b) => {
    if (a.delay > b.delay) {
      return -1;
    } else if (a.delay < b.delay) {
      return 1;
    } else {
      return 0;
    }
  });

  res.render('index', { delay_ranking });
};
