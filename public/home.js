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
            { label: 'Luminosité', fill: false, borderColor: '#FFEB3B', lineTension: 0, borderWidth: 2 },
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

var DATASET_INDEX_BY_METRIC = {
    TEMPERATURE: 0,
    CARBON_MONOXIDE: 1,
    POWER_CONSUMPTION: 2,
    LUMINOSITY: 3,
};

moment.locale('fr');

eventSource.onmessage = function (event) {
    var eventData = JSON.parse(event.data);
    var metric = eventData.metric;
    var time = eventData.time;
    var value = eventData.value;

    chart.data.labels.push(new Date(time));
    chart.data.datasets[DATASET_INDEX_BY_METRIC[metric.toUpperCase()]].data.push({ x: new Date(time), y: value});
    chart.update();
};
