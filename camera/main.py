import cv2 as cv
import redis
import os
import time
import sys
import json
import base64

redis = redis.from_url(os.getenv('REDIS', 'redis://127.0.0.1/'))

try:
    redis.ping()
except:
    print "Unable to connect to the redis database!"
    sys.exit(1)

capture = cv.VideoCapture(0)

frontalface_cascade = cv.CascadeClassifier('./models/haarcascade_frontface.xml')
eye_cascade = cv.CascadeClassifier('./models/haarcascade_eye.xml')
eyeglasses_cascade = cv.CascadeClassifier('./models/haarcascade_eyeglasses.xml')

gui = os.getenv('GUI', False)
active = False
last_alert = 0

while capture.isOpened():
    ok, frame = capture.read()
    if not ok:
        continue
    gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)
    frontal_faces = frontalface_cascade.detectMultiScale(gray, 1.3, 5)
    _, buff = cv.imencode('.png', frame)
    buff = base64.b64encode(buff.tostring())

    if not len(frontal_faces):
        active = False

    for (x, y, w, h) in frontal_faces:
        roi = gray[y: y + h, x: x + w]
        eyes = eye_cascade.detectMultiScale(roi)
        eyes_glasses = eyeglasses_cascade.detectMultiScale(roi)
        if len(eyes) or len(eyes_glasses):
            if not active:
                if time.time() - last_alert > 60:
                    print 'Sending alert by redis pub/sub!'
                    redis.publish('sensors', json.dumps({
                        'sensor': 'FACE_RECOGNITION',
                        'value': buff
                    }))
                active = True
                last_alert = time.time()
            cv.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
        else:
            active = False

    redis.publish('camera', json.dumps({
        'value': buff
    }))

    if gui:
        cv.imshow('Test', frame)

    if cv.waitKey(1) & 0xFF == ord('q'):
        break

capture.release()
if gui:
    cv.destroyAllWindows()
