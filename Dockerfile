FROM node
COPY package.json .
RUN npm install --production
ENV SLACK_TOKEN=replaceme
COPY index.js .
COPY lib lib
CMD npm start