const database = JSON.parse(document.getElementsByTagName('pre')[0].innerText);
const database_tracking = JSON.parse(document.getElementsByTagName('pre')[1].innerText);

function FillIn(text) {
  document.getElementById('search').value = text;
  ChangeSearch();
}

function Available(num, current_avg, overall_avg) {
  let overall_average = overall_avg;
  if (overall_avg == 0) {
    overall_average = 1;
  }
  if (num == 0) {
    return { text: 'Unavailable', class: 'unavailable', title: 'This shipping method is not provided for this country.' };
  } else if (num == 1) {
    if (current_avg > overall_average * 1.5) {
      return {
        text: `Available, ${Math.round((10 * current_avg) / overall_average) / 10}x delay`,
        class: 'delays',
        title: `On average, the last 2 weeks, shipments has been delayed about ${
          Math.round((10 * current_avg) / overall_average) / 10
        }x the normal average shipping time.`,
      };
    } else {
      return { text: 'Available', class: 'available', title: 'Available, with no or very small delays.' };
    }
  } else if (num == 2) {
    let delay_str = '';
    if (current_avg > overall_average * 1.5) {
      delay_str = `, ${Math.round((10 * current_avg) / overall_average) / 10}x delay`;
    }
    return {
      text: 'Suspended' + delay_str,
      class: 'suspended',
      title:
        'Orders will be put on hold for shipment until the shipping method becomes available again, previously shipped packages may be largely delayed.',
    };
  } else if (num == 3) {
    return {
      text: 'Blocked',
      class: 'blocked',
      title:
        'Suspended indefinitely, unlikely to become available again within any forseeable future.\n*Customers can NOT select this shipping method.',
    };
  } else {
    return { text: `Unknown(${num})`, class: 'unknown', title: 'Unknown status, contact Lennart!' };
  }
}

function ChangeSearch() {
  let search = document.getElementById('search').value.toUpperCase();
  const output = [];
  let tracking_number = '';

  // Do a tracking lookup
  database_tracking.forEach((dt) => {
    if (dt.tracking == search) {
      search = dt.country;
      tracking_number = dt.tracking;
    }
  });

  // Get selected index
  let index = -1;
  let code = search.charCodeAt(search.length - 1) - 48;
  if (code > 0 && code < 6) {
    index = code;
    search = search.slice(0, search.length - 1);
  }

  // Aquire data from database
  database.forEach((d) => {
    if (d.country_code == search) {
      output.unshift(d);
      if (index == -1) {
        index = 1;
      }
    } else if (d.country_name.toUpperCase() == search) {
      output.unshift(d);
      if (index == -1) {
        index = 1;
      }
    } else if (d.country_name.toUpperCase().indexOf(search) >= 0) {
      output.push(d);
    }
  });

  // If no index has been set, default to "1"
  if (index == -1) {
    index = 1;
  }

  // Print result
  document.getElementById('auto').innerHTML = '';
  for (let i = 0; i < 5; i++) {
    if (i < output.length) {
      document.getElementById('auto').innerHTML += `
            <button class="btn btn-link" onclick="FillIn('${output[i].country_name}')">${output[i].country_name} {${i + 1}}</button>
            `;
      if (i + 1 == index) {
        const format = {
          ems: Available(output[i].ems_available, output[i].ems_averagetime, output[i].ems_totalaveragetime),
          airsp: Available(output[i].airsp_available, output[i].airsp_averagetime, output[i].airsp_totalaveragetime),
          salspr: Available(output[i].salspr_available, output[i].salspr_averagetime, output[i].salspr_totalaveragetime),
          salspu: Available(output[i].salspu_available, output[i].salspu_averagetime, output[i].salspu_totalaveragetime),
          salp: Available(output[i].salp_available, output[i].salp_averagetime, output[i].salp_totalaveragetime),
          dhl: Available(output[i].dhl_available, output[i].dhl_averagetime, output[i].dhl_totalaveragetime),
          airp: Available(output[i].airp_available, output[i].airp_averagetime, output[i].airp_totalaveragetime),
        };
        document.getElementById('country').innerText = `${output[i].country_name} (${output[i].country_code})`;
        document.getElementById('tracking').innerText = tracking_number;

        // EMS
        document.getElementById(
          'ems_available'
        ).innerHTML = `<span class="${format.ems.class}" title="${format.ems.title}">${format.ems.text}</span>`;
        document.getElementById('ems_average').innerHTML = `${
          output[i].ems_averagetime > 0 ? Math.round(10 * output[i].ems_averagetime) / 10 : '--'
        } days <span class="${
          Math.round(10 * output[i].ems_averagetime) / 10 - output[i].ems_totalaveragetime < 0 ? 'fast' : 'slow'
        }" title="Overall average shipping time: ${output[i].ems_totalaveragetime} days">(${
          output[i].ems_averagetime > 0 ? Math.round(10 * (output[i].ems_averagetime - output[i].ems_totalaveragetime)) / 10 : '--'
        } days)</span>`;
        document.getElementById('ems_lastshipped').innerHTML = `${
          output[i].ems_lastsucessfullyshipped > 0 ? new Date(output[i].ems_lastsucessfullyshipped).toDateString() : ''
        }`;

        // ASP
        document.getElementById(
          'airsp_available'
        ).innerHTML = `<span class="${format.airsp.class}" title="${format.airsp.title}">${format.airsp.text}</span>`;
        document.getElementById('airsp_average').innerHTML = `${
          output[i].airsp_averagetime > 0 ? Math.round(10 * output[i].airsp_averagetime) / 10 : '--'
        } days <span class="${
          Math.round(10 * output[i].airsp_averagetime) / 10 - output[i].airsp_totalaveragetime < 0 ? 'fast' : 'slow'
        }" title="Overall average shipping time: ${output[i].airsp_totalaveragetime} days">(${
          output[i].airsp_averagetime > 0 ? Math.round(10 * (output[i].airsp_averagetime - output[i].airsp_totalaveragetime)) / 10 : '--'
        } days)</span>`;
        document.getElementById('airsp_lastshipped').innerHTML = `${
          output[i].airsp_lastsucessfullyshipped > 0 ? new Date(output[i].airsp_lastsucessfullyshipped).toDateString() : ''
        }`;

        // SAL Reg.
        document.getElementById(
          'salspr_available'
        ).innerHTML = `<span class="${format.salspr.class}" title="${format.salspr.title}">${format.salspr.text}</span>`;
        document.getElementById('salspr_average').innerHTML = `${
          output[i].salspr_averagetime > 0 ? Math.round(10 * output[i].salspr_averagetime) / 10 : '--'
        } days <span class="${
          Math.round(10 * output[i].salspr_averagetime) / 10 - output[i].salspr_totalaveragetime < 0 ? 'fast' : 'slow'
        }" title="Overall average shipping time: ${output[i].salspr_totalaveragetime} days">(${
          output[i].salspr_averagetime > 0 ? Math.round(10 * (output[i].salspr_averagetime - output[i].salspr_totalaveragetime)) / 10 : '--'
        } days)</span>`;
        document.getElementById('salspr_lastshipped').innerHTML = `${
          output[i].salspr_lastsucessfullyshipped > 0 ? new Date(output[i].salspr_lastsucessfullyshipped).toDateString() : ''
        }`;

        // SAL Unreg.
        document.getElementById(
          'salspu_available'
        ).innerHTML = `<span class="${format.salspu.class}" title="${format.salspu.title}">${format.salspu.text}</span>`;

        // SAL Parcel
        document.getElementById(
          'salp_available'
        ).innerHTML = `<span class="${format.salp.class}" title="${format.salp.title}">${format.salp.text}</span>`;
        document.getElementById('salp_average').innerHTML = `${
          output[i].salp_averagetime > 0 ? Math.round(10 * output[i].salp_averagetime) / 10 : '--'
        } days <span class="${
          Math.round(10 * output[i].salp_averagetime) / 10 - output[i].salp_totalaveragetime < 0 ? 'fast' : 'slow'
        }" title="Overall average shipping time: ${output[i].salp_totalaveragetime} days">(${
          output[i].salp_averagetime > 0 ? Math.round(10 * (output[i].salp_averagetime - output[i].salp_totalaveragetime)) / 10 : '--'
        } days)</span>`;
        document.getElementById('salp_lastshipped').innerHTML = `${
          output[i].salp_lastsucessfullyshipped > 0 ? new Date(output[i].salp_lastsucessfullyshipped).toDateString() : ''
        }`;

        // DHL
        document.getElementById(
          'dhl_available'
        ).innerHTML = `<span class="${format.dhl.class}" title="${format.dhl.title}">${format.dhl.text}</span>`;
        document.getElementById('dhl_average').innerHTML = `${
          output[i].dhl_averagetime > 0 ? Math.round(10 * output[i].dhl_averagetime) / 10 : '--'
        } days <span class="${
          Math.round(10 * output[i].dhl_averagetime) / 10 - output[i].dhl_totalaveragetime < 0 ? 'fast' : 'slow'
        }" title="Overall average shipping time: ${output[i].dhl_totalaveragetime} days">(${
          output[i].dhl_averagetime > 0 ? Math.round(10 * (output[i].dhl_averagetime - output[i].dhl_totalaveragetime)) / 10 : '--'
        } days)</span>`;
        document.getElementById('dhl_lastshipped').innerHTML = `${
          output[i].dhl_lastsucessfullyshipped > 0 ? new Date(output[i].dhl_lastsucessfullyshipped).toDateString() : ''
        }`;

        // Air Parcel
        document.getElementById(
          'airp_available'
        ).innerHTML = `<span class="${format.airp.class}" title="${format.airp.title}">${format.airp.text}</span>`;
        document.getElementById('airp_average').innerHTML = `${
          output[i].airp_averagetime > 0 ? Math.round(10 * output[i].airp_averagetime) / 10 : '--'
        } days <span class="${
          Math.round(10 * output[i].airp_averagetime) / 10 - output[i].airp_totalaveragetime < 0 ? 'fast' : 'slow'
        }" title="Overall average shipping time: ${output[i].airp_totalaveragetime} days">(${
          output[i].airp_averagetime > 0 ? Math.round(10 * (output[i].airp_averagetime - output[i].airp_totalaveragetime)) / 10 : '--'
        } days)</span>`;
        document.getElementById('airp_lastshipped').innerHTML = `${
          output[i].airp_lastsucessfullyshipped > 0 ? new Date(output[i].airp_lastsucessfullyshipped).toDateString() : ''
        }`;
      }
    } else {
      document.getElementById(`num${i + 1}`).innerText = '';
    }
  }
}

ChangeSearch();
