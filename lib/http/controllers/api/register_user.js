var gateway = require(__dirname+'/../../../../');

module.exports = function(req, res) {

  var opts = {
    name: req.body.name,
    password: req.body.password,
    ripple_address: req.body.ripple_address,
    secret: req.body.secret,
    currency: req.body.currency,
    amount: req.body.amount
  };

  gateway.api.registerUser(opts, function(err, user){
    if (err) {
      res.send(500, {error: err});
    } else {
      res.send({ user: user });
    }
  });
  
};
