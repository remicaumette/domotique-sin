import redis
import os
import sys
import json
import RPi.GPIO as GPIO

redis = redis.from_url(os.getenv('REDIS', 'redis://127.0.0.1/'))
ledPin = 27
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(ledPin, GPIO.OUT)

try:
    redis.ping()
except:
    print "Unable to connect to the redis database!"
    sys.exit(1)

redisGet = redis.get('desired_temperature')
desiredTemperature = int(redisGet) if redisGet else 19

subscriber = redis.pubsub()
subscriber.subscribe("updates", "sensors")

presence = 0
luminosity = 0

def updateLamp():
    if presence and luminosity <= 40:
        print 'Allumer la lampe'
    else:
        print 'Eteindre la lampe'

while True:
    for message in subscriber.listen():
        if message['type'] == 'message':
            data = json.loads(message['data'])
            if 'type' in data:
                if data['type'] == 'UPDATE_DOOR_STATUS':
                    if data['value']:
                        print 'Ouverture de la porte'
                        GPIO.output(ledPin, GPIO.LOW)
                    else:
                        print 'Fermeture de la porte'
                        GPIO.output(ledPin, GPIO.HIGH)
                elif data['type'] == 'DESIRED_TEMPERATURE':
                    desiredTemperature = data['value']
                    print 'Changement de la temperature desiree'
            elif 'sensor' in data:
                if data['sensor'] == 'TEMPERATURE':
                    if data['value'] >= desiredTemperature:
                        print 'Allumer le chauffage'
                    else:
                        print 'Eteindre le chauffage'
                elif data['sensor'] == 'PRESENCE':
                    presence = data['value']
                    updateLamp()
                elif data['sensor'] == 'LUMINOSITY':
                    luminosity = data['value']
                    updateLamp()

