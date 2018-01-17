/* eslint-disable */

var eventSource = new EventSource('/events');

var chart = new Chart(document.getElementById('chart'), {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            { label: 'Température', fill: false, borderColor: '#304FFE', lineTension: 0, borderWidth: 2 },
            { label: 'Monoxyde de carbone', fill: false, borderColor: '#424242', lineTension: 0, borderWidth: 2 },
            { label: 'Consommation électrique', fill: false, borderColor: '#00C853', lineTension: 0, borderWidth: 2 },
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
    },
});

var DATASET_INDEX_BY_SENSOR = {
    TEMPERATURE: 0,
    CARBON_MONOXIDE: 1,
    POWER_CONSUMPTION: 2,
};

moment.locale('fr');

eventSource.onmessage = function (event) {
    var dataArray = JSON.parse(event.data);
    dataArray = dataArray.length ? dataArray : [dataArray];
    console.log('Données reçus ('+ dataArray.length +')');
    dataArray.forEach(function (data) {
        chart.data.labels.push(new Date(data.receivedAt));
        chart.data.datasets[DATASET_INDEX_BY_SENSOR[data.sensor]].data.push({ x: new Date(data.receivedAt), y: data.value});
        chart.update();
    });
};
