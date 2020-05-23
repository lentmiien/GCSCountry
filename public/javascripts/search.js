const database = JSON.parse(document.getElementsByTagName('pre')[0].innerText);

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
        text: `${Math.round((10 * current_avg) / overall_average) / 10}x delay`,
        class: 'delays',
        title: `On average, the last 2 weeks, shipments has been delayed about ${
          Math.round((10 * current_avg) / overall_average) / 10
        }x the normal average shipping time.`,
      };
    } else {
      return { text: 'Available', class: 'available', title: 'Available and no large delays.' };
    }
  } else if (num == 2) {
    return {
      text: 'Suspended',
      class: 'suspended',
      title: 'This shipping method is temporarilly unavailable,\nand previously shipped packages may be largely delayed.',
    };
  } else if (num == 3) {
    return {
      text: 'Blocked',
      class: 'blocked',
      title:
        'Permanently suspended, unlikely to become available again within any forseeable future.\n*Customers can NOT select this shipping method.',
    };
  } else {
    return { text: `Unknown(${num})`, class: 'unknown', title: 'Unknown status, contact Lennart!' };
  }
}

function ChangeSearch() {
  let search = document.getElementById('search').value.toUpperCase();
  const output = [];

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
        document.getElementById('output').innerHTML = `
                <h3>${output[i].country_name}</h3>
                <table class="table table-dark table-striped">
                    <thead>
                        <tr>
                            <th span="col"></th>
                            <th span="col" title="Available, delay and Suspended can be selected by customers.\nFor Suspended, the order will be shipped when the shipping method becomes available again.">Status*</th>
                            <th span="col">Average last 2 weeks<br>(compared to all time average)</th>
                            <th span="col" title="Shipped and delivered">Last successfully<br>shipped*</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th span="row">EMS</th>
                            <td><span class="${format.ems.class}" title="${format.ems.title}">${format.ems.text}</span></td>
                            <td>${Math.round(10 * output[i].ems_averagetime) / 10} days <span class="${
          Math.round(10 * output[i].ems_averagetime) / 10 - 20 < 0 ? 'fast' : 'slow'
        }" title="Overall average shipping time: 20 days">(${Math.round(10 * (output[i].ems_averagetime - 20)) / 10} days)</span></td>
                            <td>${new Date(output[i].ems_lastsucessfullyshipped).toDateString()}</td>
                        </tr>
                        <tr>
                            <th span="row">ASP</th>
                            <td><span class="${format.airsp.class}" title="${format.airsp.title}">${format.airsp.text}</span></td>
                            <td>${Math.round(10 * output[i].airsp_averagetime) / 10} days <span class="${
          Math.round(10 * output[i].airsp_averagetime) / 10 - 20 < 0 ? 'fast' : 'slow'
        }" title="Overall average shipping time: 20 days">(${Math.round(10 * (output[i].airsp_averagetime - 20)) / 10} days)</span></td>
                            <td>${new Date(output[i].airsp_lastsucessfullyshipped).toDateString()}</td>
                        </tr>
                        <tr>
                            <th span="row">SAL Reg.</th>
                            <td><span class="${format.salspr.class}" title="${format.salspr.title}">${format.salspr.text}</span></td>
                            <td>${Math.round(10 * output[i].salspr_averagetime) / 10} days <span class="${
          Math.round(10 * output[i].salspr_averagetime) / 10 - 20 < 0 ? 'fast' : 'slow'
        }" title="Overall average shipping time: 20 days">(${Math.round(10 * (output[i].salspr_averagetime - 20)) / 10} days)</span></td>
                            <td>${new Date(output[i].salspr_lastsucessfullyshipped).toDateString()}</td>
                        </tr>
                        <tr>
                            <th span="row">SAL Unreg.</th>
                            <td><span class="${format.salspu.class}" title="${format.salspu.title}">${format.salspu.text}</span></td>
                            <td>${Math.round(10 * output[i].salspu_averagetime) / 10} days <span class="${
          Math.round(10 * output[i].salspu_averagetime) / 10 - 20 < 0 ? 'fast' : 'slow'
        }" title="Overall average shipping time: 20 days">(${Math.round(10 * (output[i].salspu_averagetime - 20)) / 10} days)</span></td>
                            <td>${new Date(output[i].salspu_lastsucessfullyshipped).toDateString()}</td>
                        </tr>
                        <tr>
                            <th span="row">SAL Parcel</th>
                            <td><span class="${format.salp.class}" title="${format.salp.title}">${format.salp.text}</span></td>
                            <td>${Math.round(10 * output[i].salp_averagetime) / 10} days <span class="${
          Math.round(10 * output[i].salp_averagetime) / 10 - 20 < 0 ? 'fast' : 'slow'
        }" title="Overall average shipping time: 20 days">(${Math.round(10 * (output[i].salp_averagetime - 20)) / 10} days)</span></td>
                            <td>${new Date(output[i].salp_lastsucessfullyshipped).toDateString()}</td>
                        </tr>
                        <tr>
                            <th span="row">DHL</th>
                            <td><span class="${format.dhl.class}" title="${format.dhl.title}">${format.dhl.text}</span></td>
                            <td>${Math.round(10 * output[i].dhl_averagetime) / 10} days <span class="${
          Math.round(10 * output[i].dhl_averagetime) / 10 - 20 < 0 ? 'fast' : 'slow'
        }" title="Overall average shipping time: 20 days">(${Math.round(10 * (output[i].dhl_averagetime - 20)) / 10} days)</span></td>
                            <td>${new Date(output[i].dhl_lastsucessfullyshipped).toDateString()}</td>
                        </tr>
                        <tr>
                            <th span="row">Air Parcel</th>
                            <td><span class="${format.airp.class}" title="${format.airp.title}">${format.airp.text}</span></td>
                            <td>${Math.round(10 * output[i].airp_averagetime) / 10} days <span class="${
          Math.round(10 * output[i].airp_averagetime) / 10 - 20 < 0 ? 'fast' : 'slow'
        }" title="Overall average shipping time: 20 days">(${Math.round(10 * (output[i].airp_averagetime - 20)) / 10} days)</span></td>
                            <td>${new Date(output[i].airp_lastsucessfullyshipped).toDateString()}</td>
                        </tr>
                    </tbody>
                </table>
                `;
      }
    } else {
      document.getElementById(`num${i + 1}`).innerText = '';
    }
  }
}

ChangeSearch();
