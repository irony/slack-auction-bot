// Requiring our module
var slack = require('./lib/slackStream')

// manual deconstruction.. ;)
var bids = slack.bids
var auctions = slack.auctions


var startAuction = (auction) => {
  auction.send(`Started auction on ${auction.item}.
                              Start bidding with \`bid ${auction.bidInterval}\``)
  return auction
}

var handleAuction = (auction) => {
  auction.rejectedBids = bids.fork().filter((bid) => bid.amount < auction.price)
  auction.acceptedBids = bids.fork().filter((bid) => bid.amount > auction.price)
  auction.acceptedBids.fork().pluck('amount').each((price) => auction.price = price)
  return auction
}

var informAuction = (auction) => {
  auction.rejectedBids.fork()
    .each((bid) => {
      auction.send(`Bid not accepted. Current price is ${auction.price}${auction.currency}`)
    })

  auction.acceptedBids.fork()
    .each((bid) => {
      auction.send(`New bid accepted for ${auction.item}.
                              Highest bidder: ${bid.user.name}
                              Bid: ${bid.amount}${auction.currency}

                              To win the auction, bid at least \`bid ${bid.amount + auction.bidInterval }\` within ${auction.waitTime / 1000}s
                              `)
    })
}

var countdownAuction = (auction) => {
  var countdownUser
  var countdown = auction.acceptedBids.fork()
    .debounce(auction.waitTime)
    .map((bid) => {
      countdownUser = bid.user
      auction.send(`First announcement for ${auction.price}${auction.currency}`)
      return bid
    })
    .debounce(auction.waitTime)
    .map((bid) => {
      if (countdownUser !== bid.user) countdown.destroy()
      auction.send(`Second announcement for ${auction.price}${auction.currency}`)
      return bid
    })
    .debounce(auction.waitTime)
    .map((bid) => {
      if (countdownUser !== bid.user) countdown.destroy()
      auction.send(`Third announcement for ${auction.price}${auction.currency}`)
      return bid
    })
    .debounce(auction.waitTime)
    .map((bid) => {
      bid.auction = auction
      return bid
    })
  return countdown
}

var handleWinner = (bid) => {
  bid.auction.send(`Auction ended! Winner is ${bid.user.name}`)
  console.log('Send email to ', bid.user, 'for winning', bid.auction)
}

var closeAuction = (bid) => {
  bid.auction.winner = bid.user
}

auctions
.map(startAuction)
.map(handleAuction)
.map(informAuction)
.map(countdownAuction)
.map(handleWinner)
.map(closeAuction)
