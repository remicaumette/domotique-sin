/* eslint-disable */

moment.locale('fr');

var eventSource = new EventSource('/events');

var CHART_BY_SENSOR = {
    TEMPERATURE: new Chart(document.getElementById('temperature-chart'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                { label: 'Température', fill: false, borderColor: '#304FFE' },
            ]
        }
    }),
    CARBON_MONOXIDE: new Chart(document.getElementById('carbon-monoxide-chart'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                { label: 'Monoxyde de carbone', fill: false, borderColor: '#304FFE' },
            ]
        }
    }),
    POWER_CONSUMPTION: new Chart(document.getElementById('power-consumption-chart'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                { label: 'Consommation électrique', fill: false, borderColor: '#304FFE' },
            ]
        }
    }),
}

eventSource.onmessage = function (event) {
    var dataArray = JSON.parse(event.data);
    dataArray = dataArray.length ? dataArray : [dataArray];
    console.log('Données reçus ('+ dataArray.length +')');
    dataArray.forEach(function (data) {
        var chart = CHART_BY_SENSOR[data.sensor];
        chart.data.labels.push(moment(data.receivedAt).calendar());
        chart.data.datasets[0].data.push(data.value);
        chart.update();
    });
};
