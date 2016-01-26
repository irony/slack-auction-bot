// Requiring our module
var slack = require('./lib/slackStream')

slack.auctions
  .doto((auction) => auction.listen(slack.bids))
  .each((auction) => {

    // Auction started
    auction.send(`Started auction on ${auction.name}.
                                Start bidding with \`bid ${auction.bidInterval}\``)

    // Rejected bids
    auction.rejectedBids.fork()
    .each((bid) => auction.send(`Bid not accepted. Current price is ${auction.price}${auction.currency}`))

    // Accepted bids
    auction.acceptedBids.fork()
    .each((bid) => auction.send(`New bid accepted for ${auction.name}.
                                Highest bidder: ${bid.user.name}
                                Bid: ${bid.amount}${auction.currency}

                                To win the auction, bid at least \`bid ${bid.amount + auction.bidInterval }\` within ${auction.waitTime / 1000}s
                                `))

    auction.winner.each((bid) => {
      auction.send(`Auction ended! Winner is ${bid.user.name}`)
    })
  })
