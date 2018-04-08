/* eslint-disable */
Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};

require(['c3', 'jquery'], function (c3, $) {
    $(document).ready(function () {
        /** FUNCTIONS */
        function displayAlert(type, message) {
            var alerts = document.getElementById('alerts');
            alerts.innerHTML = '<div class="alert alert-' + type + '" role="alert"><button type="button" class="close" data-dismiss="alert"></button> ' + message + '</div>';
        }

        function handleError() {
            displayAlert('danger', "Une erreur s'est produite merci de réessayer plus tard.");
        }

        function makeSensor(element, name) {
            return {
                chart: c3.generate({
                    bindto: document.getElementById(element),
                    data: {
                        x: 'x',
                        columns: [
                            ['x'],
                            ['y'],
                        ],
                        names: {
                            y: name,
                        },
                    },
                    axis: {
                        x: {
                            type: 'timeseries',
                            tick: {
                                format: '%H:%M',
                            },
                        },
                    },
                    legend: {
                        show: false,
                    },
                    padding: {
                        bottom: 0,
                        top: 0,
                    },
                }),
                data: [
                    ['x'],
                    ['y'],
                ],
            };
        }

        /** DESIRED TEMPERATURE */
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

        document.getElementById('desired-temperature-form').onsubmit = function (event) {
            event.preventDefault();
            fetch('/desired_temperature', {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({ temperature: parseInt(document.getElementById('desired-temperature').value) }),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(function (resp) {
                    if (resp.ok && resp.status === 204) {
                        displayAlert('success', "La température voulue vient d'être mise à jour");
                    } else {
                        throw new Error('An internal error occurred');
                    }
                })
                .catch(handleError);
        };

        /** SENSORS EVENTS */
        var eventSource = new EventSource('/events');

        var SENSORS = {
            TEMPERATURE: makeSensor('temperature-chart', 'Température'),
            HUMIDITY: makeSensor('humidity-chart', 'Humidité'),
            VOLATIL_ORGANIC_COMPOUND: makeSensor('volatil-organic-compound-chart', 'Composé organique volatil'),
            POWER_CONSUMPTION: makeSensor('power-consumption-chart', 'Consommation électrique'),
            LUMINOSITY: makeSensor('luminosity-chart', 'Luminosité'),
        };

        eventSource.onmessage = function (event) {
            var eventData = JSON.parse(event.data);
            var sensor = SENSORS[eventData.sensor.toUpperCase()];
            var time = new Date(eventData.time);
            var value = eventData.value;

            if (sensor) {
                var x = sensor.data[0];
                var y = sensor.data[1];

                x.push(time.getTime());
                y.push(value);

                sensor.chart.load({
                    columns: sensor.data
                });
            }
        };
    });
});
