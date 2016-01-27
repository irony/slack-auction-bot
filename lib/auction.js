'use strict'

class Auction {
  constructor (options) {
    Object.assign(this, {
      price: 0,
      bidInterval: 10,
      currency: 'kr',
      waitTime: 10 * 1000
    }, options)
  }

  listen (bids) {
    this.rejectedBids = bids
      .fork()
      .filter((bid) => bid.amount < this.price)

    this.acceptedBids = bids
      .fork()
      .filter((bid) => bid.amount > this.price)

    this.acceptedBids.fork()
      .pluck('amount')
      .each((price) => this.price = price)

    // for every new bid, restart the countdown
    if (this.winner) this.winner.destroy()
    this.winner = this.countdown(this.acceptedBids)
  }

  countdown (bids) {
    return bids.fork()
    .debounce(this.waitTime)
    .doto((bid) => {
      this.send(`First announcement for ${this.price}${this.currency}`)
    })
    .debounce(this.waitTime)
    .doto((bid) => {
      this.send(`Second announcement for ${this.price}${this.currency}`)
    })
    .debounce(this.waitTime)
    .doto((bid) => {
      this.send(`Third announcement for ${this.price}${this.currency}`)
    })
    .debounce(this.waitTime)
    .map(this.close)
  }
  
  close (bid) {
    return bid
  }
}

module.exports = Auction
