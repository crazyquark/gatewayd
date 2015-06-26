var data = require(__dirname+'/../data/');
var sql = require(__dirname +'/../data/sequelize.js');
var config = require(__dirname+'/../../config/environment.js');
var validator = require(__dirname+'/../validator.js');
var RippleRestClient = require('ripple-rest-client');

/**
* Register a User
* - creates external account named "default"
* - creates ripple address as provided
* @require data, sql, config
* @param {string} name
* @param {string} rippleAddress
* @param {string} password
* @returns {User}, {ExternalAccount}, {RippleAddress}
*/

function registerUser(opts, fn) {
  var userOpts = {
    name: opts.name,
    password: opts.password,
    address: opts.ripple_address,
    secret: opts.secret,
    currency: opts.currency,
    amount: opts.amount 
  };

  if (!validator.isRippleAddress(opts.ripple_address)) {
    fn({ ripple_address: 'invalid ripple address' });
    return;
  }

  sql.transaction(function(sqlTransaction){
    data.users.create(userOpts, function(err, user) {
      if (err) { sqlTransaction.rollback(); fn(err, null); return; }
      var addressOpts = {
        user_id: user.id,
        address: opts.ripple_address,
        managed: false,
        type: 'independent'
      };
      data.rippleAddresses.create(addressOpts, function(err, ripple_address) {
      if (err) { sqlTransaction.rollback(); fn(err, null); return; }
        data.externalAccounts.create({ name: 'default', user_id: user.id, address:addressOpts.address, type:addressOpts.type }, function(err, account){
          if (err) { fn(err, null); return; }
          var addressOpts = {
            user_id: user.id,
            address: config.get('COLD_WALLET'),
            managed: true,
            type: 'hosted',
            tag: account.id
          };
          
          // We might be missing the cold wallet
          if (addressOpts.address) {
            data.rippleAddresses.create(addressOpts, function(err, hosted_address) {
              if (err) { sqlTransaction.rollback(); fn(err, null); return; }
              var response = user.toJSON();
              response.ripple_address = ripple_address;
              response.external_account = account;
              response.hosted_address = hosted_address;
              sqlTransaction.commit();
              fn(err, response);
            });
            
            var coldWallet = config.get('COLD_WALLET');
            
            var rippleRestClient = new RippleRestClient({
              api: config.get('RIPPLE_REST_API'),
              account:ripple_address
            });
            
            rippleRestClient.setTrustLines({
              account: userOpts.address,
              secret: userOpts.secret,
              limit: userOpts.amount,
              currency: userOpts.currency,
              counterparty: coldWallet,
              account_allows_rippling: true
            }, fn); 
          }
        });
      });
    });
  });
}

module.exports = registerUser;

