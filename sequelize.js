const Sequelize = require('sequelize');
// Load models
const CountryModel = require('./models/country');
const CountrylistModel = require('./models/countrylist');
const TrackingModel = require('./models/tracking');

// TODO: Delete when done
const temp_db = require('./input_data.json');

// Connect to DB
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false,
});

// Attach DB to model
const Country = CountryModel(sequelize, Sequelize);
const Countrylist = CountrylistModel(sequelize, Sequelize);
const Tracking = TrackingModel(sequelize, Sequelize);

const Op = Sequelize.Op;

// Create all necessary tables
sequelize.sync().then(() => {
  console.log(`Database & tables syncronized!`);

  // TODO: Remove when done
  Country.findAll().then((results) => {
    if (results.length == 0) {
      const data = [];
      temp_db.forEach((d) => {
        data.push({
          country_code: d.code,
          country_name: d.name,
          ems_available: 1,
          ems_averagetime: 0,
          ems_totalaveragetime: 0,
          ems_lastsucessfullyshipped: 0,
          airsp_available: 1,
          airsp_averagetime: 0,
          airsp_totalaveragetime: 0,
          airsp_lastsucessfullyshipped: 0,
          salspr_available: 1,
          salspr_averagetime: 0,
          salspr_totalaveragetime: 0,
          salspr_lastsucessfullyshipped: 0,
          salspu_available: 1,
          salspu_averagetime: 0,
          salspu_totalaveragetime: 0,
          salspu_lastsucessfullyshipped: 0,
          salp_available: 1,
          salp_averagetime: 0,
          salp_totalaveragetime: 0,
          salp_lastsucessfullyshipped: 0,
          dhl_available: 1,
          dhl_averagetime: 0,
          dhl_totalaveragetime: 0,
          dhl_lastsucessfullyshipped: 0,
          airp_available: 1,
          airp_averagetime: 0,
          airp_totalaveragetime: 0,
          airp_lastsucessfullyshipped: 0,
        });
      });
      Country.bulkCreate(data);
    }
  });

  // TODO: Remove when done
  Countrylist.findAll().then((results) => {
    if (results.length == 0) {
      const data = [];
      temp_db.forEach((d) => {
        data.push({
          country_code: d.code,
          country_name: d.name,
          baseentry: true,
        });
      });
      Countrylist.bulkCreate(data);
    }
  });
});

// Export models
module.exports = {
  Country,
  Countrylist,
  Tracking,
  Op,
};
