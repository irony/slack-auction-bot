FROM node
COPY package.json .
RUN npm install --production
ENV SLACK_TOKEN=replaceme
CMD npm start