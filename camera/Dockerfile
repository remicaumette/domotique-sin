FROM node

ADD . /app
WORKDIR /app

ENV REDIS=redis://127.0.0.1/

RUN pip install -r requirements.txt

CMD [ "python", "start" ]
