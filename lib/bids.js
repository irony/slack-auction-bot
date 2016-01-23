module.exports = (slack) => {
  var bids = {
    isBid: (data) => data.text.includes('bid'),
    extract: (data) => {
      return {
        amount: parseFloat(data.text.split('bid').pop().trim(), 10),
        user: slack.getUser(data.user),
        time: new Date()
      }
    },

    countdown: (auction) => {
      return auction.acceptedBids.fork()
        .debounce(auction.waitTime)
        .map((bid) => {
          slack.sendMsg(auction.channel, `First announcment for ${auction.price}${auction.currency}`)
          return bid
        })
        .debounce(auction.waitTime)
        .map((bid) => {
          slack.sendMsg(auction.channel, `Second announcment for ${auction.price}${auction.currency}`)
          return bid
        })
        .debounce(auction.waitTime)
        .map((bid) => {
          slack.sendMsg(auction.channel, `Third announcment for ${auction.price}${auction.currency}`)
          return bid
        })
        .debounce(auction.waitTime)
    }

  }
  return bids
}
