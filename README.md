Slack Auction Bot
=================

Use Slack to sell stuff on Slack. 

## Usage



## Instructions

Set this up on a machine. Get a bot user token from Slack (https://tutum-community.slack.com/apps/new/A0F7YS25R-bots) and store it in a separate file called config.json or use the ENV variable SLACK_TOKEN=token.


```
npm install --production
SLACK_TOKEN=yourToken npm start
```

or use Docker:

```
docker run -d irony/slack-auction-bot
```
