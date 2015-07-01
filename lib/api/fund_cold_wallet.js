var RippleRestClient  = require('ripple-rest-client');
var uuid              = require('node-uuid');
var config            = require(__dirname+'/../../config/environment.js');

var rippleRestClient = new RippleRestClient({
  api: config.get('RIPPLE_REST_API'),
  account: 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh'
});

function fundColdWallet(payment, callback) {
  var options = {
    secret: payment.secret,
    client_resource_id: uuid.v4(),
    payment: {
      destination_account: config.get('COLD_WALLET'),
      source_account: 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
      destination_amount: {
        value: payment.amount.toString(),
        currency: payment.currency,
        issuer: payment.issuer || ''
      }
    }
  };

  rippleRestClient.sendAndConfirmPayment(options, function(error, response){
    if (error || (response.result !== 'tesSUCCESS')) {
      logger.error('rippleRestClient.sendAndConfirmPayment', error);
      return callback(error, null);
    }
    callback(null, response);
  });
}

module.exports = fundColdWallet;
