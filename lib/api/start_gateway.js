var path       = require('path');
var Supervisor = require(path.join(__dirname,'/../processes/supervisor'));

/**
 * @function startGateway
 * @requires GatewayProcessManager
 * @description Starts gateway processes.
 * @param opts
 */

/** TODO:
  var rippleRestClient = new RippleRestClient({
    api: config.get('RIPPLE_REST_API'),
    account: hotWallet.address
  });

  rippleRestClient.setTrustLines({
    account: hotWallet.address,
    secret: hotWallet.secret,
    limit: amount,
    currency: currency,
    counterparty: coldWallet
  }, callback);

}
*/

function startGateway() {
  return new Supervisor().start();
}

module.exports = startGateway;

