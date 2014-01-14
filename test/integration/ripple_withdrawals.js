assert = require('assert')
Ripple = require('../../lib/ripple')

describe('withdrawing to ripple', function() {
  before(function(){
    client = new Ripple.Gateway.Client({
      api: 'http://localhost:3000',
      clientId: 'adminUsername',  
      clientSecret: 'somethingSuperSecretAndRandom'
    })
  })
  it('create a valid transaction record', function(done){
    client.createRippleTransaction({ 
      toCurrency: 'XAG',
      fromCurrency: 'XAG',
      toAmount: '10',
      fromAmount: '10.01', 
      toIssuer: 'someIssurRippleAddress',
      fromIssuer: 'someIssurRippleAddress',
      toAddress: 'someRippleAddress',
      fromAddress: 'someRippleAddress',
      sendTag: '10',
      issuance: true
    }, function(err, res){
      console.log(err)
      console.log(res)
      assert.equal(res.rippleTransaction.txState, 'created') 
      done()
    })
  })
})