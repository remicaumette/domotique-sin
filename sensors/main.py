import redis
import os
import sys
import json
import RPi.GPIO as GPIO
import time

redis = redis.from_url(os.getenv('REDIS', 'redis://127.0.0.1/'))
buttonPin = 22
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(buttonPin, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

try:
    redis.ping()
except:
    print "Unable to connect to the redis database!"
    sys.exit(1)

while True:
    if GPIO.input(buttonPin):
        print "Demande"
        data = json.dumps({ "sensor": "BUTTON", "value": 1 })
        redis.publish("sensors", data)
	time.sleep(5)
