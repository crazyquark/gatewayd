var RippleRestClient  = require('ripple-rest-client');
var uuid              = require('node-uuid');
var config            = require(__dirname+'/../../config/environment.js');

var rippleRestClient = new RippleRestClient({
  api: config.get('RIPPLE_REST_API'),
  account: config.get('COLD_WALLET')
});

function fundHotWallet(payment, callback) {
  var options = {
    secret: payment.secret,
    client_resource_id: uuid.v4(),
    payment: {
      destination_account: config.get('HOT_WALLET').address,
      source_account: config.get('COLD_WALLET'),
      destination_amount: {
        value: payment.amount.toString(),
        currency: payment.currency,
        issuer: payment.issuer || ''
      }
    }
  };

  rippleRestClient.sendAndConfirmPayment(options, function(error, response){
    if (error || (response.success !== true)) {
      logger.error('rippleRestClient.sendAndConfirmPayment', error);
      return callback(error, null);
    }
    callback(null, response);
  });
}

module.exports = fundHotWallet;
