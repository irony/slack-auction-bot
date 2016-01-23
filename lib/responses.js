module.export = {
  auctionStarted: (auction) => `Started auction on ${auction.item}.
                                  Start bidding with \`bid ${auction.bidInterval}\``,

  bidRejected: (bid) => `Bid not accepted. Current price is ${bid.auction.price}${bid.auction.currency}`,
  bidAccepted: (bid) => `New bid accepted for ${bid.auction.item}.
                            Highest bidder: ${bid.user.name}
                            Bid: ${bid.amount}${bid.auction.currency}

                            To win the auction, bid at least \`bid ${bid.amount + bid.auction.bidInterval }\` within ${bid.auction.waitTime / 1000}s
                            `,
  finished: (bid) => `Auction ended! Winner is ${bid.user.name}`
}
