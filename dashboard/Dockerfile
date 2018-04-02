FROM node

ADD . /app
WORKDIR /app

ENV REDIS=redis://127.0.0.1/
ENV SECRET=wowthisismysecret
ENV PORT=3000

RUN npm install

CMD [ "npm", "start" ]
