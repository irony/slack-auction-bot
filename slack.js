// Requiring our module
var SlackBot = require('slackbotapi')
var _ = require('highland')

// Starting
var slack = new SlackBot({
  'token': 'xoxb-19248986821-14YWpqfOZVeINoZ4ogJnLf1W',
  'logging': false,
  'autoReconnect': true
})

var bidHelper = require('./lib/bids')(slack)
var auctionHelper = require('./lib/auction')(slack)
var responses = require('./lib/responses')

// messages

var messages = _('message', slack)

// auctions
var auctions = messages.fork()
  .filter(auctionHelper.isAuction)
  .map(auctionHelper.start)

// bids
var bids = messages.fork()
  .filter(bids.isBid)
  .map(bids.extractBid)

// handle closing logic
var finished = auctions.fork()
  .map(bidHelper.countdown)

var findAuction = (bid) => bid.auction = auctions.filter((a) => !a.winner).slice(-1)[0] && bid
var validBid = (bid) => bid.amount > bid.auction.price
var invalidBid = (bid) => !validBid(bid)
var send = (message) => slack.sendMsg(auction.channel, message))

// connect them
var started = bids
  .map(findAuction)
  .map((bid) => {
    var auction = bid.auction
    auction.rejectedBids = auction.bids.fork().filter(invalidBid)
    auction.acceptedBids = auction.bids.fork().filter(validBid)
    auction.acceptedBids.fork().pluck('amount').each((price) => auction.price = price)
    return auction
  })

// messages
started.fork()
  .map((auction) => {
    [responses.auctionStarted(auction),
      auction.rejectedBids.fork().map(responses.bidRejected),
      auction.acceptedBids.fork().map(responses.bidAccepted),
      finished.fork().map(responses.finished)
    ].flatten().each((message) => slack.sendMsg(auction.channel, message))
  })
