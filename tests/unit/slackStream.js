/* eslint-env mocha */

var oboy = require('oboy')
var EventEmitter = require('events').EventEmitter

oboy((expect, sinon, proxyquire) => {
  var emitter
  var slackbotapi
  var slack

  beforeEach((done) => {
    emitter = new EventEmitter()
    emitter.setMaxListeners(0)
    slackbotapi = sinon.stub().returns(emitter)
    emitter.getUser = sinon.stub().returns({})

    slack = proxyquire('../../lib/slackStream', {
      slackbotapi: slackbotapi
    })
    done()
  })

  describe('slack', _ => {
    it('has all streams registered', (done) => {
      expect(slack).to.have.property('auctions')
      expect(slack).to.have.property('bids')
      expect(slack).to.have.property('messages')
      done()
    })

    it('messages are registered', (done) => {
      emitter.emit('message', {text: 'sell foo'})
      slack.messages.fork().head().each((msg) => {
        expect(msg).to.have.eql({text: 'sell foo'})
        done()
      })
    })

    it('one message is parsed', (done) => {
      emitter.emit('message', {text: 'sell foo'})
      slack.auctions.fork().head().each((auction) => {
        expect(auction).to.have.property('name')
        expect(auction.name).to.have.eql('foo')
        done()
      })
    })

    describe('bids', function () {
      it('are parsed', (done) => {
        slack.bids.fork().head().each((bid) => {
          expect(bid).to.have.property('amount')
          expect(bid.amount).to.have.eql(33)
          done()
        })
        emitter.emit('message', {text: 'bid 33', user: 'B'})
      })
    })

    describe('auction', function () {
      it('one is parsed', (done) => {
        emitter.emit('message', {text: 'sell foo', user: 'A'})
        slack.auctions.fork().head().each((auction) => {
          expect(auction).to.have.property('name')
          expect(auction.name).to.have.eql('foo')
          done()
        })
      })

      it('two has been parsed', (done) => {
        emitter.emit('message', {text: 'sell foo', user: 'A'})
        emitter.emit('message', {text: 'sell bar', user: 'B'})
        slack.auctions.head().each((auction) => {
          expect(auction.name).to.be.eql('foo')
          done()
        })
        slack.auctions.last().each((auction) => {
          expect(auction.name).to.be.eql('bar')
          done()
        })
      })

      xit('two has been parsed as an array', (done) => {
        emitter.emit('message', {text: 'sell foo', user: 'A'})
        emitter.emit('message', {text: 'sell bar', user: 'B'})
        slack.auctions.toArray((auctions) => {
          expect(auctions[0].name).to.be.eql('foo')
          expect(auctions[1].name).to.be.eql('bar')
          done()
        })
      })
    })
  })
})
