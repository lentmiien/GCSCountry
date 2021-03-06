// Require used packages

// Require necessary database models
const { Country, Countrylist, Tracking, Op } = require('../sequelize');

//---------------------------------------------//
// exports.endpoints = (req, res, next) => {}; //
//---------------------------------------------//

exports.mypage = (req, res, next) => {
  Country.findAll().then((countries) => {
    Tracking.findAll({ attributes: ['tracking', 'country'] }).then((trackings) => {
      Countrylist.findAll().then((countrylist) => {
        // Create country code lookup table
        cc_lookup = {};
        countrylist.forEach((ce) => {
          cc_lookup[ce.country_name] = ce.country_code;
        });

        // Replace country with country code
        for (let i = 0; i < trackings.length; i++) {
          trackings[i].country = cc_lookup[trackings[i].country];
        }

        res.render('mypage', { countries, trackings });
      });
    });
  });
};

exports.update_page = (req, res) => {
  Country.findAll().then((results) => {
    res.render('update', { countries: results });
  });
};
exports.update_value = (req, res) => {
  let update_data = {};
  update_data[`${req.body.method}_available`] = req.body.status;
  Country.update(update_data, { where: { country_code: req.body.country_code } })
    .then(() => {
      res.json({ status: 'OK' });
    })
    .catch(() => {
      res.json({ status: 'FAILED' });
    });
};

// Calculate average shipping times
exports.recalculate = async (req, res) => {
  //const countries = await Country.findAll();
  const countrylist = await Countrylist.findAll();
  const countrylist_base = countrylist.filter((a) => a.baseentry);
  const trackings = await Tracking.findAll();

  // Create country code lookup table
  cc_lookup = {};
  countrylist.forEach((ce) => {
    cc_lookup[ce.country_name] = ce.country_code;
  });

  // Last 2 weeks
  const l2w = Date.now() - 1209600000;

  // Calculate averages
  const unknown_countries = [];
  const averages = {};
  trackings.forEach((t) => {
    if (cc_lookup[t.country]) {
      const cc = cc_lookup[t.country];
      if (t.delivereddate > t.shippeddate) {
        // Create entry if not existing
        if (!averages[cc]) {
          averages[cc] = {
            ems_2week_days: 0,
            ems_2week_cnt: 0,
            ems_days: 0,
            ems_cnt: 0,
            ems_shippeddate: 0,
            airsp_2week_days: 0,
            airsp_2week_cnt: 0,
            airsp_days: 0,
            airsp_cnt: 0,
            airsp_shippeddate: 0,
            salspr_2week_days: 0,
            salspr_2week_cnt: 0,
            salspr_days: 0,
            salspr_cnt: 0,
            salspr_shippeddate: 0,
            salspu_2week_days: 0,
            salspu_2week_cnt: 0,
            salspu_days: 0,
            salspu_cnt: 0,
            salspu_shippeddate: 0,
            salp_2week_days: 0,
            salp_2week_cnt: 0,
            salp_days: 0,
            salp_cnt: 0,
            salp_shippeddate: 0,
            dhl_2week_days: 0,
            dhl_2week_cnt: 0,
            dhl_days: 0,
            dhl_cnt: 0,
            dhl_shippeddate: 0,
            airp_2week_days: 0,
            airp_2week_cnt: 0,
            airp_days: 0,
            airp_cnt: 0,
            airp_shippeddate: 0,
          };
        }

        // Add data (TODO: change to use "method" when implemented)
        if (t.carrier == 'DHL') {
          if (t.delivereddate > l2w) {
            averages[cc].dhl_2week_cnt++;
            averages[cc].dhl_2week_days += (t.delivereddate - t.shippeddate) / (1000 * 60 * 60 * 24);
          }
          averages[cc].dhl_cnt++;
          averages[cc].dhl_days += (t.delivereddate - t.shippeddate) / (1000 * 60 * 60 * 24);

          if (t.shippeddate > averages[cc].dhl_shippeddate) {
            averages[cc].dhl_shippeddate = t.shippeddate;
          }
        } else if (t.tracking.indexOf('EM') == 0) {
          if (t.delivereddate > l2w) {
            averages[cc].ems_2week_cnt++;
            averages[cc].ems_2week_days += (t.delivereddate - t.shippeddate) / (1000 * 60 * 60 * 24);
          }
          averages[cc].ems_cnt++;
          averages[cc].ems_days += (t.delivereddate - t.shippeddate) / (1000 * 60 * 60 * 24);

          if (t.shippeddate > averages[cc].ems_shippeddate) {
            averages[cc].ems_shippeddate = t.shippeddate;
          }
        } else if (t.tracking.indexOf('RM') == 0) {
          // TEMPORARY: do not know which so add to both
          if (t.delivereddate > l2w) {
            averages[cc].airsp_2week_cnt++;
            averages[cc].salspr_2week_cnt++;
            averages[cc].airsp_2week_days += (t.delivereddate - t.shippeddate) / (1000 * 60 * 60 * 24);
            averages[cc].salspr_2week_days += (t.delivereddate - t.shippeddate) / (1000 * 60 * 60 * 24);
          }
          averages[cc].airsp_cnt++;
          averages[cc].salspr_cnt++;
          averages[cc].airsp_days += (t.delivereddate - t.shippeddate) / (1000 * 60 * 60 * 24);
          averages[cc].salspr_days += (t.delivereddate - t.shippeddate) / (1000 * 60 * 60 * 24);

          if (t.shippeddate > averages[cc].airsp_shippeddate) {
            averages[cc].airsp_shippeddate = t.shippeddate;
            averages[cc].salspr_shippeddate = t.shippeddate;
          }
        } else if (t.tracking.indexOf('CC') == 0) {
          // TEMPORARY: do not know which so add to both
          if (t.delivereddate > l2w) {
            averages[cc].airp_2week_cnt++;
            averages[cc].salp_2week_cnt++;
            averages[cc].airp_2week_days += (t.delivereddate - t.shippeddate) / (1000 * 60 * 60 * 24);
            averages[cc].salp_2week_days += (t.delivereddate - t.shippeddate) / (1000 * 60 * 60 * 24);
          }
          averages[cc].airp_cnt++;
          averages[cc].salp_cnt++;
          averages[cc].airp_days += (t.delivereddate - t.shippeddate) / (1000 * 60 * 60 * 24);
          averages[cc].salp_days += (t.delivereddate - t.shippeddate) / (1000 * 60 * 60 * 24);

          if (t.shippeddate > averages[cc].airp_shippeddate) {
            averages[cc].airp_shippeddate = t.shippeddate;
            averages[cc].salp_shippeddate = t.shippeddate;
          }
        }
      }
    } else {
      let new_country = true;
      for (let ci = 0; ci < unknown_countries.length && new_country; ci++) {
        if (unknown_countries[ci] == t.country) {
          new_country = false;
        }
      }
      if (new_country) {
        unknown_countries.push(t.country);
      }
    }
  });

  // Update database
  for (let key of Object.keys(averages)) {
    const update_values = {
      ems_small_sample: averages[key].ems_2week_cnt > 0 && averages[key].ems_2week_cnt < 5,
      ems_averagetime: averages[key].ems_2week_days / (averages[key].ems_2week_cnt > 0 ? averages[key].ems_2week_cnt : 1),
      ems_totalaveragetime: averages[key].ems_days / (averages[key].ems_cnt > 0 ? averages[key].ems_cnt : 1),
      ems_lastsucessfullyshipped: averages[key].ems_shippeddate,

      airsp_small_sample: averages[key].airsp_2week_cnt > 0 && averages[key].airsp_2week_cnt < 5,
      airsp_averagetime: averages[key].airsp_2week_days / (averages[key].airsp_2week_cnt > 0 ? averages[key].airsp_2week_cnt : 1),
      airsp_totalaveragetime: averages[key].airsp_days / (averages[key].airsp_cnt > 0 ? averages[key].airsp_cnt : 1),
      airsp_lastsucessfullyshipped: averages[key].airsp_shippeddate,

      salspr_small_sample: averages[key].salspr_2week_cnt > 0 && averages[key].salspr_2week_cnt < 5,
      salspr_averagetime: averages[key].salspr_2week_days / (averages[key].salspr_2week_cnt > 0 ? averages[key].salspr_2week_cnt : 1),
      salspr_totalaveragetime: averages[key].salspr_days / (averages[key].salspr_cnt > 0 ? averages[key].salspr_cnt : 1),
      salspr_lastsucessfullyshipped: averages[key].salspr_shippeddate,

      salspu_small_sample: averages[key].salspu_2week_cnt > 0 && averages[key].salspu_2week_cnt < 5,
      salspu_averagetime: averages[key].salspu_2week_days / (averages[key].salspu_2week_cnt > 0 ? averages[key].salspu_2week_cnt : 1),
      salspu_totalaveragetime: averages[key].salspu_days / (averages[key].salspu_cnt > 0 ? averages[key].salspu_cnt : 1),
      salspu_lastsucessfullyshipped: averages[key].salspu_shippeddate,

      salp_small_sample: averages[key].salp_2week_cnt > 0 && averages[key].salp_2week_cnt < 5,
      salp_averagetime: averages[key].salp_2week_days / (averages[key].salp_2week_cnt > 0 ? averages[key].salp_2week_cnt : 1),
      salp_totalaveragetime: averages[key].salp_days / (averages[key].salp_cnt > 0 ? averages[key].salp_cnt : 1),
      salp_lastsucessfullyshipped: averages[key].salp_shippeddate,

      dhl_small_sample: averages[key].dhl_2week_cnt > 0 && averages[key].dhl_2week_cnt < 5,
      dhl_averagetime: averages[key].dhl_2week_days / (averages[key].dhl_2week_cnt > 0 ? averages[key].dhl_2week_cnt : 1),
      dhl_totalaveragetime: averages[key].dhl_days / (averages[key].dhl_cnt > 0 ? averages[key].dhl_cnt : 1),
      dhl_lastsucessfullyshipped: averages[key].dhl_shippeddate,

      airp_small_sample: averages[key].airp_2week_cnt > 0 && averages[key].airp_2week_cnt < 5,
      airp_averagetime: averages[key].airp_2week_days / (averages[key].airp_2week_cnt > 0 ? averages[key].airp_2week_cnt : 1),
      airp_totalaveragetime: averages[key].airp_days / (averages[key].airp_cnt > 0 ? averages[key].airp_cnt : 1),
      airp_lastsucessfullyshipped: averages[key].airp_shippeddate,
    };
    Country.update(update_values, { where: { country_code: key } });
  }

  res.render('status', { unknown_countries, countrylist_base });
};

exports.addcl = (req, res) => {
  let add_data = {
    country_name: req.body.country_name,
    country_code: req.body.country_code,
    baseentry: false,
  };
  Countrylist.create(add_data);
  res.json({ status: 'OK' });
};

exports.country_graphs = async (req, res) => {
  const countrylist = await Countrylist.findAll();
  const countrylist_base = countrylist.filter((a) => a.baseentry);
  const trackings = await Tracking.findAll({ where: { delivereddate: { [Op.gt]: 1 } } });

  // Show data for country code
  const dataforcc = req.params.countrycode;

  // Create country code lookup table
  const cc_lookup = {};
  let country = '';
  countrylist.forEach((ce) => {
    if (ce.country_code == dataforcc) {
      cc_lookup[ce.country_name] = ce.country_code;

      // Save a copy of this country name
      if (ce.baseentry) {
        country = ce.country_name;
      }
    } else {
      cc_lookup[ce.country_name] = null;
    }
  });

  // Generate graph data array
  const graphdata = [];
  const sevendays = 1000 * 60 * 60 * 24 * 7;
  const now = Date.now();
  for (let i = 0; i < 52; i++) {
    graphdata.push({
      start: now - sevendays * (i + 1),
      end: now - sevendays * i,
      ems_cnt: 0,
      ems_days: 0,
      airsp_cnt: 0,
      airsp_days: 0,
      salspr_cnt: 0,
      salspr_days: 0,
      salspu_cnt: 0,
      salspu_days: 0,
      salp_cnt: 0,
      salp_days: 0,
      dhl_cnt: 0,
      dhl_days: 0,
      airp_cnt: 0,
      airp_days: 0,
    });
  }

  // Loop through tracking data
  const oneday = 1000 * 60 * 60 * 24;
  trackings.forEach(entry => {
    if (cc_lookup[entry.country] != null) {
      for (let i = 0; i < 52; i++) {
        if (entry.delivereddate > graphdata[i].start && entry.delivereddate <= graphdata[i].end) {
          // Add data (TODO: change to use "method" when implemented)
          if (entry.carrier == 'DHL') {
            graphdata[i].dhl_cnt++;
            graphdata[i].dhl_days += (entry.delivereddate - entry.shippeddate) / oneday;
          } else if (entry.tracking.indexOf('EM') == 0) {
            graphdata[i].ems_cnt++;
            graphdata[i].ems_days += (entry.delivereddate - entry.shippeddate) / oneday;
          } else if (entry.tracking.indexOf('RM') == 0) {
            // TEMPORARY: do not know which so add to both
            graphdata[i].airsp_cnt++;
            graphdata[i].airsp_days += (entry.delivereddate - entry.shippeddate) / oneday;
            graphdata[i].salspr_cnt++;
            graphdata[i].salspr_days += (entry.delivereddate - entry.shippeddate) / oneday;
          } else if (entry.tracking.indexOf('CC') == 0) {
            // TEMPORARY: do not know which so add to both
            graphdata[i].salp_cnt++;
            graphdata[i].salp_days += (entry.delivereddate - entry.shippeddate) / oneday;
            graphdata[i].airp_cnt++;
            graphdata[i].airp_days += (entry.delivereddate - entry.shippeddate) / oneday;
          }        
        }
      }
    }
  });

  // Render page
  res.render('country_graph', { country, country_code: dataforcc, graphdata });
};
