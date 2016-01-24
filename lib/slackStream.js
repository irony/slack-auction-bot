// Requiring our module
var SlackBot = require('slackbotapi')
var _ = require('highland')

var slack = new SlackBot({
  'token': 'xoxb-19248986821-14YWpqfOZVeINoZ4ogJnLf1W',
  'logging': false,
  'autoReconnect': true
})

// Start
var messages = _('message', slack)

var auctions = messages.fork()
  .filter(isAuction)
  .map(extractAuction)

var bids = messages.fork()
  .filter(isBid)
  .map(extractBid)

module.exports = {auctions, bids, messages}
