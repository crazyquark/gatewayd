var RippleRestClient  = require('ripple-rest-client');
var uuid              = require('node-uuid');
var config = require(__dirname+'/../../config/environment.js');

var rippleRestClient = new RippleRestClient({
  api: config.get('RIPPLE_REST_API'),
  account: config.get('COLD_WALLET')
});

// TODO CS This is based on fund_hot_wallet.js. 
// I didn't want to re-use the fundHotWallet method however because I am not sure this is what issuing currency means
function issueCurrency(amount, currency, secret, callback) {
	var options = {
    secret: secret,
    client_resource_id: uuid.v4(),
      payment: {
        destination_account: config.get('HOT_WALLET').address,
        source_account: config.get('COLD_WALLET'),
        destination_amount: {
          value: amount.toString(),
          currency: currency,
          issuer: ''
        }
    	}
  	};
  
  rippleRestClient.sendAndConfirmPayment(options, function(error, response){
    if (error || (response.success != true)) {
      logger.error('rippleRestClient.sendAndConfirmPayment', error);
      return callback(error, null);
    }
    callback(null, response);
  });
  
}

module.exports = issueCurrency;