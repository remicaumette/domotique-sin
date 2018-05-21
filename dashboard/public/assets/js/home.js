/* eslint-disable */

function displayAlert(type, message) {
    var alerts = document.getElementById('alerts');
    alerts.innerHTML = '<div class="alert alert-' + type + '" role="alert"><button type="button" class="close" data-dismiss="alert"></button> ' + message + '</div>';
}

function handleError() {
    displayAlert('danger', "Une erreur s'est produite merci de réessayer plus tard.");
}

function updateDoorStatus(state) {
    fetch('/door_status', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ state: state }),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(function (resp) {
            if (resp.ok && resp.status === 200) {
                displayAlert('success', state ? "Porte ouverte" : "Porte fermé");
            } else {
                throw new Error('An internal error occurred');
            }
        })
        .catch(handleError);
}

require(['c3', 'jquery'], function (c3, $) {
    $(document).ready(function () {
        /** FUNCTIONS */
        function uri2array(uri, buffer) {
            var marker = ';base64,',
                raw = window.atob(uri.substring(uri.indexOf(marker) + marker.length)),
                n = raw.length,
                a = new Uint8Array(new ArrayBuffer(n));
            for (var i = 0; i < n; i++) {
                a[i] = raw.charCodeAt(i);
            }
            return buffer ? a.buffer : a;
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
                    if (resp.ok && resp.status === 200) {
                        displayAlert('success', "La température voulue vient d'être mise à jour");
                    } else {
                        throw new Error('An internal error occurred');
                    }
                })
                .catch(handleError);
        };

        /** SENSORS EVENTS */
        var SENSORS = {
            TEMPERATURE: makeSensor('temperature-chart', 'Température'),
            HUMIDITY: makeSensor('humidity-chart', 'Humidité'),
            VOLATIL_ORGANIC_COMPOUND: makeSensor('volatil-organic-compound-chart', 'Composé organique volatil'),
            POWER_CONSUMPTION: makeSensor('power-consumption-chart', 'Consommation électrique'),
            LUMINOSITY: makeSensor('luminosity-chart', 'Luminosité'),
        };
        var socket = io();
        var uriCache;

        socket.on('sensors', function(event) {
            var sensor = SENSORS[event.sensor.toUpperCase()];
            var time = new Date(event.time);
            var value = event.value;

            if (sensor) {
                var x = sensor.data[0];
                var y = sensor.data[1];

                x.push(time.getTime());
                y.push(value);

                sensor.chart.load({
                    columns: sensor.data
                });
            } else if (event.sensor.toUpperCase() === 'FACE_RECOGNITION') {
                var element = document.getElementById('face-recognition');
                var uri = URL.createObjectURL(new Blob([uri2array('data:image/png;base64,' + value)], { type: 'image/png' }));
                element.innerHTML = element.innerHTML + '<div class="col-6 col-md-4 col-lg-3 col-xl-2"><img class="rounded" src="'+ uri +'"/></div>';
            } else if (event.sensor.toUpperCase() === 'BUTTON') {
                displayAlert('success', "Quelqu'un sonne à la porte.");
            }
        });

        socket.on('camera', function (event) {
            if (uriCache) {
                URL.revokeObjectURL(uriCache);
                uriCache = undefined;
            }
            uriCache = URL.createObjectURL(new Blob([uri2array('data:image/png;base64,' + event)], { type: 'image/png' }));
            document.getElementById('camera').src = uriCache;
        });

        socket.emit('ready');
    });
});
