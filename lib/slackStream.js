'use strict'

// Requiring our module
const SlackBot = require('slackbotapi')
const _ = require('highland')
const Auction = require('./auction')
var slack

// Start

// Bids
const isBid = (data) => data.text.startsWith('bid')
const parseBid = (data) => {
  return {
    amount: parseFloat(data.text.split('bid').pop().trim(), 10),
    user: slack.getUser(data.user),
    time: new Date()
  }
}

// Auctions
const isAuction = (data) => data.text.startsWith('sell')
const createAuction = (data) => {
  return new Auction({
    name: data.text.split('sell').pop().trim(),
    seller: slack.getUser(data.user),
    send: (msg) => slack.sendMsg(data.channel, msg)
  })
}

module.exports = (token) => {
  slack = new SlackBot({
    'token': token,
    'logging': false,
    'autoReconnect': true
  })

  const messages = _('message', slack)

  const auctions = _('message', slack)
  .filter(isAuction)
  .map(createAuction)

  const bids = _('message', slack)
  .filter(isBid)
  .map(parseBid)

  return {auctions, bids, messages}
}
