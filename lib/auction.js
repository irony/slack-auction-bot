'use strict'

class Auction {
  constructor (options) {
    Object.assign(this, {
      price: 0,
      bidInterval: 10,
      currency: options.currency || 'kr',
      waitTime: options.waitTime || (10 * 1000)
    }, options)
  }

  updateLeader (bid) {
    this.leader = bid.user
    this.price = bid.amount
  }

  listen (bids) {
    this.rejectedBids = bids
      .fork()
      .filter((bid) => bid.amount < this.price)

    this.acceptedBids = bids
      .fork()
      .filter((bid) => bid.amount > this.price)

    this.acceptedBids
      .fork()
      .each(this.updateLeader)

    this.winner = this.countdown(this.acceptedBids)
    return this.winner
  }

  announcement1 (bid) {
    this.send(`First announcement for ${this.price}${this.currency} by ${this.user}`)
  }

  announcement2 (bid) {
    this.send(`Second announcement for ${this.price}${this.currency} by ${this.user}`)
  }

  announcement3 (bid) {
    this.send(`Third announcement for ${this.price}${this.currency} by ${this.user}`)
  }

  isCurrentBid (bid) {
    return !this.closed && bid.leader === bid.user
  }

  countdown (bids) {

    return bids.fork()
    .debounce(this.waitTime)
    .filter(this.isCurrentBid)
    .doto(this.announcement1)

    .debounce(this.waitTime)
    .filter(this.isCurrentBid)
    .doto(this.announcement2)

    .debounce(this.waitTime)
    .filter(this.isCurrentBid)
    .doto(this.announcement3)
    .map(this.close)
  }

  close (bid) {
    this.closed = true
    return bid
  }
}

module.exports = Auction
