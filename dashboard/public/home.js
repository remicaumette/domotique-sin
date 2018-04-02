/* eslint-disable */

var eventSource = new EventSource('/events');

function makeChart(element, name) {
    return new Chart(document.getElementById(element), {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                { label: name, fill: false, borderColor: '#304FFE', pointBackgroundColor: '#304FFE', lineTension: 0, borderWidth: 4 },
            ],
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        displayFormats: {
                            quarter: 'hh:mm'
                        },
                    },
                }],
            },
            legend: {
                display: false,
            },
        },
    });
}

var CHART_BY_METRIC = {
    TEMPERATURE: makeChart('temperature-chart', 'Température'),
    CARBON_MONOXIDE: makeChart('carbon-monoxide-chart', 'Monoxyde de carbone'),
    POWER_CONSUMPTION: makeChart('power-consumption-chart', 'Consommation électrique'),
    LUMINOSITY: makeChart('luminosity-chart', 'Luminosité'),
};

moment.locale('fr');

eventSource.onmessage = function (event) {
    var eventData = JSON.parse(event.data);
    var metric = eventData.metric;
    var time = new Date(eventData.time);
    var value = eventData.value;
    var chart = CHART_BY_METRIC[metric.toUpperCase()];

    if (chart) {
        chart.data.labels.push(time);
        chart.data.datasets[0].data.push({ x: time, y: value });
        chart.update();
    }
};

function displayAlert(type, message) {
    var alerts = document.getElementById('alerts');
    alerts.innerHTML = '<div class="alert alert-'+ type +'" role="alert">'+ message +'</div>';
}

function handleError() {
    displayAlert('danger', "Une erreur s'est produite merci de réessayer plus tard.");
}

document.getElementById('desired-temperature-form').onsubmit = function(event) {
    event.preventDefault();
    var value = document.getElementById('desired-temperature').value;
    fetch('/desired_temperature', { method: 'POST', credentials: 'include' })
        .then(function (resp) {
            if (resp.ok && resp.status === 204) {
                displayAlert('success', "La température voulue vient d'être mise à jour");
            } else {
                throw new Error('An internal error occurred');
            }
        })
        .catch(handleError);
};

window.onload = function() {
    fetch('/desired_temperature', { method: 'GET', credentials: 'include' })
        .then(function (resp) {
            if (resp.ok && resp.status === 200) {
                return resp.json();
            } else {
                throw new Error('An internal error occurred');
            }
        })
        .then(function (data) {
            document.getElementById('desired-temperature').value = data.temperature;
        })
        .catch(handleError);
}
