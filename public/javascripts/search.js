const database = JSON.parse(document.getElementsByTagName('pre')[0].innerText);

function FillIn(text) {
    document.getElementById('search').value = text;
    ChangeSearch();
}

function Available(num, current_avg, overall_avg) {
    if (num == 0) {
        return { text: "Unavailable", class: "unavailable", title: "This shipping method is not provided for this country." };
    } else if (num == 1) {
        if (current_avg > overall_avg * 1.5) {
            return { text: `${Math.round(10 * current_avg / overall_avg) / 10}x delay`, class: "delays", title: `On average, the last 2 weeks, shipments has been delayed about ${Math.round(10 * current_avg / overall_avg) / 10}x the normal average shipping time.` };
        } else {
            return { text: "Available", class: "available", title: "Available and no large delays." };
        }
    } else if (num == 2) {
        return { text: "Suspended", class: "suspended", title: "This shipping method is temporarilly unavailable,\nand previously shipped packages may be largely delayed." };
    } else if (num == 3) {
        return { text: "Blocked", class: "blocked", title: "Permanently suspended, unlikely to become available again within any forseeable future.\n*Customers can NOT select this shipping method." };
    } else {
        return { text: `Unknown(${num})`, class: "unknown", title: "Unknown status, contact Lennart!" };
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
        if(d.code == search) {
            output.unshift(d);
            if (index == -1) {
                index = 1;
            }
        } else if(d.name.toUpperCase() == search) {
            output.unshift(d);
            if (index == -1) {
                index = 1;
            }
        } else if(d.name.toUpperCase().indexOf(search) >= 0) {
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
            <button class="btn btn-link" onclick="FillIn('${output[i].name}')">${output[i].name} {${i + 1}}</button>
            `;
            if (i + 1 == index) {
                for (let j = 0; j < database.length; j++) {
                    if (database[j].name === output[i].name) {
                        const format = {
                            ems: Available(database[j].ems.available, database[j].ems.averagetime, 20),
                            airsp: Available(database[j].airsp.available, database[j].airsp.averagetime, 20),
                            salspr: Available(database[j].salspr.available, database[j].salspr.averagetime, 20),
                            salspu: Available(database[j].salspu.available, database[j].salspu.averagetime, 20),
                            salp: Available(database[j].salp.available, database[j].salp.averagetime, 20),
                            dhl: Available(database[j].dhl.available, database[j].dhl.averagetime, 20),
                            airp: Available(database[j].airp.available, database[j].airp.averagetime, 20),
                        };
                        document.getElementById('output').innerHTML = `
                        <h3>${database[j].name}</h3>
                        <table class="table table-dark table-striped">
                            <thead>
                                <tr>
                                    <th span="col"></th>
                                    <th span="col" title="Available, delay and Suspended can be selected by customers.\nFor Suspended, the order will be shipped when the shipping method becomes available again.">Status*</th>
                                    <th span="col">Average last 2 weeks<br>(compared to all time average)</th>
                                    <th span="col" title="Shipped and delivered">Last successfully<br>shipped*</th>
                                    <th span="col">Last successfully<br>delivered</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th span="row">EMS</th>
                                    <td><span class="${format.ems.class}" title="${format.ems.title}">${format.ems.text}</span></td>
                                    <td>${Math.round(10 * database[j].ems.averagetime) / 10} days <span class="${Math.round(10 * database[j].ems.averagetime) / 10 - 20 < 0 ? 'fast' : 'slow'}" title="Overall average shipping time: 20 days">(${Math.round(10 * (database[j].ems.averagetime - 20)) / 10} days)</span></td>
                                    <td>${new Date(database[j].ems.lastsucessfullyshipped).toDateString()}</td>
                                    <td>${new Date(database[j].ems.lastsucessfullydelivered).toDateString()}</td>
                                </tr>
                                <tr>
                                    <th span="row">ASP</th>
                                    <td><span class="${format.airsp.class}" title="${format.airsp.title}">${format.airsp.text}</span></td>
                                    <td>${Math.round(10 * database[j].airsp.averagetime) / 10} days <span class="${Math.round(10 * database[j].airsp.averagetime) / 10 - 20 < 0 ? 'fast' : 'slow'}" title="Overall average shipping time: 20 days">(${Math.round(10 * (database[j].airsp.averagetime - 20)) / 10} days)</span></td>
                                    <td>${new Date(database[j].airsp.lastsucessfullyshipped).toDateString()}</td>
                                    <td>${new Date(database[j].airsp.lastsucessfullydelivered).toDateString()}</td>
                                </tr>
                                <tr>
                                    <th span="row">SAL Reg.</th>
                                    <td><span class="${format.salspr.class}" title="${format.salspr.title}">${format.salspr.text}</span></td>
                                    <td>${Math.round(10 * database[j].salspr.averagetime) / 10} days <span class="${Math.round(10 * database[j].salspr.averagetime) / 10 - 20 < 0 ? 'fast' : 'slow'}" title="Overall average shipping time: 20 days">(${Math.round(10 * (database[j].salspr.averagetime - 20)) / 10} days)</span></td>
                                    <td>${new Date(database[j].salspr.lastsucessfullyshipped).toDateString()}</td>
                                    <td>${new Date(database[j].salspr.lastsucessfullydelivered).toDateString()}</td>
                                </tr>
                                <tr>
                                    <th span="row">SAL Unreg.</th>
                                    <td><span class="${format.salspu.class}" title="${format.salspu.title}">${format.salspu.text}</span></td>
                                    <td>${Math.round(10 * database[j].salspu.averagetime) / 10} days <span class="${Math.round(10 * database[j].salspu.averagetime) / 10 - 20 < 0 ? 'fast' : 'slow'}" title="Overall average shipping time: 20 days">(${Math.round(10 * (database[j].salspu.averagetime - 20)) / 10} days)</span></td>
                                    <td>${new Date(database[j].salspu.lastsucessfullyshipped).toDateString()}</td>
                                    <td>${new Date(database[j].salspu.lastsucessfullydelivered).toDateString()}</td>
                                </tr>
                                <tr>
                                    <th span="row">SAL Parcel</th>
                                    <td><span class="${format.salp.class}" title="${format.salp.title}">${format.salp.text}</span></td>
                                    <td>${Math.round(10 * database[j].salp.averagetime) / 10} days <span class="${Math.round(10 * database[j].salp.averagetime) / 10 - 20 < 0 ? 'fast' : 'slow'}" title="Overall average shipping time: 20 days">(${Math.round(10 * (database[j].salp.averagetime - 20)) / 10} days)</span></td>
                                    <td>${new Date(database[j].salp.lastsucessfullyshipped).toDateString()}</td>
                                    <td>${new Date(database[j].salp.lastsucessfullydelivered).toDateString()}</td>
                                </tr>
                                <tr>
                                    <th span="row">DHL</th>
                                    <td><span class="${format.dhl.class}" title="${format.dhl.title}">${format.dhl.text}</span></td>
                                    <td>${Math.round(10 * database[j].dhl.averagetime) / 10} days <span class="${Math.round(10 * database[j].dhl.averagetime) / 10 - 20 < 0 ? 'fast' : 'slow'}" title="Overall average shipping time: 20 days">(${Math.round(10 * (database[j].dhl.averagetime - 20)) / 10} days)</span></td>
                                    <td>${new Date(database[j].dhl.lastsucessfullyshipped).toDateString()}</td>
                                    <td>${new Date(database[j].dhl.lastsucessfullydelivered).toDateString()}</td>
                                </tr>
                                <tr>
                                    <th span="row">Air Parcel</th>
                                    <td><span class="${format.airp.class}" title="${format.airp.title}">${format.airp.text}</span></td>
                                    <td>${Math.round(10 * database[j].airp.averagetime) / 10} days <span class="${Math.round(10 * database[j].airp.averagetime) / 10 - 20 < 0 ? 'fast' : 'slow'}" title="Overall average shipping time: 20 days">(${Math.round(10 * (database[j].airp.averagetime - 20)) / 10} days)</span></td>
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

ChangeSearch();
