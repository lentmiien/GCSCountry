const database = JSON.parse(document.getElementsByTagName('pre')[0].innerText);

function Available(num) {
    if (num == 0) {
        return "Unavailable";
    } else if (num == 1) {
        return "Available";
    } else if (num == 2) {
        return "Suspended";
    } else {
        return `Unknown(${num})`;
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
    database.forEach(d => {
        if(d.name.indexOf(search) >= 0) {
            output.push(d.name);
        }
    });

    // Print result
    for (let i = 0; i < 5; i++) {
        if (i < output.length) {
            document.getElementById(`num${i+1}`).innerText = output[i] + ` <${i+1}>`;
            if (i + 1 == index) {
                for (let j = 0; j < database.length; j++) {
                    if (database[j].name === output[i]) {
                        document.getElementById('output').innerHTML = `
                        <table class="table table-dark table-striped">
                            <thead>
                                <tr>
                                    <th span="col"></th>
                                    <th span="col">Status</th>
                                    <th span="col">Average</th>
                                    <th span="col">Last shipped</th>
                                    <th span="col">Last delivered</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th span="row">Country</th>
                                    <td colspan="4">${database[j].name}</td>
                                </tr>
                                <tr>
                                    <th span="row">EMS</th>
                                    <td>${Available(database[j].ems.available)}</td>
                                    <td>${Math.round(10 * database[j].ems.averagetime) / 10} days</td>
                                    <td>${new Date(database[j].ems.lastsucessfullyshipped).toDateString()}</td>
                                    <td>${new Date(database[j].ems.lastsucessfullydelivered).toDateString()}</td>
                                </tr>
                                <tr>
                                    <th span="row">ASP</th>
                                    <td>${Available(database[j].airsp.available)}</td>
                                    <td>${Math.round(10 * database[j].airsp.averagetime) / 10} days</td>
                                    <td>${new Date(database[j].airsp.lastsucessfullyshipped).toDateString()}</td>
                                    <td>${new Date(database[j].airsp.lastsucessfullydelivered).toDateString()}</td>
                                </tr>
                                <tr>
                                    <th span="row">SAL Reg</th>
                                    <td>${Available(database[j].salspr.available)}</td>
                                    <td>${Math.round(10 * database[j].salspr.averagetime) / 10} days</td>
                                    <td>${new Date(database[j].salspr.lastsucessfullyshipped).toDateString()}</td>
                                    <td>${new Date(database[j].salspr.lastsucessfullydelivered).toDateString()}</td>
                                </tr>
                                <tr>
                                    <th span="row">SAL Unreg</th>
                                    <td>${Available(database[j].salspu.available)}</td>
                                    <td>${Math.round(10 * database[j].salspu.averagetime) / 10} days</td>
                                    <td>${new Date(database[j].salspu.lastsucessfullyshipped).toDateString()}</td>
                                    <td>${new Date(database[j].salspu.lastsucessfullydelivered).toDateString()}</td>
                                </tr>
                                <tr>
                                    <th span="row">SAL P</th>
                                    <td>${Available(database[j].salp.available)}</td>
                                    <td>${Math.round(10 * database[j].salp.averagetime) / 10} days</td>
                                    <td>${new Date(database[j].salp.lastsucessfullyshipped).toDateString()}</td>
                                    <td>${new Date(database[j].salp.lastsucessfullydelivered).toDateString()}</td>
                                </tr>
                                <tr>
                                    <th span="row">DHL</th>
                                    <td>${Available(database[j].dhl.available)}</td>
                                    <td>${Math.round(10 * database[j].dhl.averagetime) / 10} days</td>
                                    <td>${new Date(database[j].dhl.lastsucessfullyshipped).toDateString()}</td>
                                    <td>${new Date(database[j].dhl.lastsucessfullydelivered).toDateString()}</td>
                                </tr>
                                <tr>
                                    <th span="row">Air P</th>
                                    <td>${Available(database[j].airp.available)}</td>
                                    <td>${Math.round(10 * database[j].airp.averagetime) / 10} days</td>
                                    <td>${new Date(database[j].airp.lastsucessfullyshipped).toDateString()}</td>
                                    <td>${new Date(database[j].airp.lastsucessfullydelivered).toDateString()}</td>
                                </tr>
                            </tbody>
                        </table>
                        `;
                    }
                }
            }
        } else {
            document.getElementById(`num${i+1}`).innerText = '';
        }
    }
}