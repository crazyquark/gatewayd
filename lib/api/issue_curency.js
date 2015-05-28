var config = require(__dirname+'/../../config/environment.js');

// TODO CS This is just stub so that the wizard does not fail
function issueCurrency(amount, currency, secret, fn) {
	fn(null, amount);
}

module.exports = issueCurrency;