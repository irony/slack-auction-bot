module.exports = (slack) => {
  return {
    isAuction: (data) => data.text.includes('sell'),
    start: (data) => {
      var item = data.text.split('sell').pop()
      var auction = {
        channel: data.channel,
        seller: data.user,
        item: item,
        price: 0,
        bidInterval: 10,
        currency: 'kr',
        waitTime: 10 * 1000
      }
      return auction
    },
    

          auction.countdown = bids.countdown(auction).each((bid) => {
            slack.sendMsg(auction.channel, `Auction ended! Winner is ${bid.user.name}`)
          })
    
  },
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
