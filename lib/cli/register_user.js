var gateway = require(__dirname+'/../../');
var PrettyPrintTable = require(__dirname+'/../views/text/');

/**
* Register a User
* - creates external account named "default"
* - creates ripple address as provided
*
* @param {string} name
* @param {string} rippleAddress 
* @param {string} password
* @returns {User}, {ExternalAccount}, {RippleAddress}
*/

function registerUser(username, password, rippleAddress, secret, currency, amount){

  var opts = {
    name: username,
    password: password,
    ripple_address: rippleAddress,
    secret: secret,
    currency: currency,
    amount: amount
  };

  gateway.api.registerUser(opts, function(err, user) {
    if (err) {
      logger.info('Error reigstering user, changes rollback back');
      logger.error(err);
    } else {
      logger.info('### CREATED USER ###');
      PrettyPrintTable.users([user]);
      logger.info('### CREATED RIPPLE ADDRESSES ###');
      PrettyPrintTable.rippleAddresses([user.hosted_address, user.ripple_address]);
      logger.info('### CREATED EXTERNAL ACCOUNT ###');
      PrettyPrintTable.externalAccounts([user.external_account]);
    }
  });

}

module.exports = registerUser;

