// Requiring our module
var slack = require('./lib/slackStream')

slack.messages.fork().each((msg) => console.log('msg', msg))
