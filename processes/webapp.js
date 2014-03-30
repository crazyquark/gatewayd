var nconf = require('../config/nconf.js');
process.env.DATABASE_URL = nconf.get('DATABASE_URL');

var express = require('express');
var fs = require('fs');
var https = require('https');
var abstract = require("../lib/abstract.js");
var gateway = require('../lib/gateway.js');

var api = require(nconf.get('RIPPLE_DATAMODEL_ADAPTER'));
var passport = require('../config/passport')(api);

app = express();

app.use("/", express.static(__dirname + "/../app"));
app.use(express.json());
app.use(express.urlencoded());

app.get('/app', function(req, res) {
  fs.readFile(__dirname + '/../app/app.html', 'utf8', function(err, text){
      res.send(text);
  });
});

app.post('/api/v1/register', function(req, res) {
  abstract.registerUser(req.body, function(err, user){
    if (err) {
      res.send(500, { error: err });
    } else {
      res.send({ user: user });
    }
  })
});

app.get('/api/v1/users/:name/ripple_address', function(req, res) {
  abstract.getUserRippleAddress(req.params.name, function(err, address) {
    if (err) {
      res.send(500, { error: err });
    } else {
      res.send({ ripple_address: address });
    }
  });  
});

app.get('/api/v1/users/:name/external_account', function(req, res) {
  abstract.getUserExternalAccount(req.params.name, function(err, account) {
    if (err) {
      res.send(500, { error: err });
    } else {
      res.send({ external_account: account });
    }
  });  

});

app.get('/api/v1/users/:name', function(req, res) {
  abstract.getUser(req.params.name, function(err, user) {
    if (err) {
      res.send(500, { error: err });
    } else {
      res.send({ user: user });
    }
  });
});

app.get('/api/v1/users/:name/withdraw', function(req, res) {
  abstract.getUserExternalAccount(req.params.name, function(err, account) {
    if (err) {
      res.send(500, { error: err });
    } else {
      res.send({ ripple_address: nconf.get("gateway_cold_wallet")+"?dt="+account.id });
    }
  });
});

app.get('/api/v1/users/:id/external_transactions', function(req, res) {
  abstract.readAllUserExternalTransactions(req.params.id, function(err, transactions) {
    if (err) {
      res.send(500, { error: err });
    } else {
      res.send({ external_transactions: transactions });
    }
  });    
});

app.post('/api/v1/users', function(req, res){
  var opts = {
    name: req.body.name,
    password: req.body.password
  };
  api.users.create(opts, function(err, user){
    console.log(err, user);
    if (err) {
      res.send(500, { error: err });
    } else {
      res.send({ user: user.toJSON() });
    }
  });
});

app.post('/api/v1/deposits', function(req, res) {
  gateway.deposits.record({
    currency: req.body.currency,
    amount: req.body.amount,
    external_account_id: req.body.external_account_id
  }, function(err, deposit) {
    if (err) {
      res.send(500, { error: err });
    } else {
      res.send({ deposit:  deposit });
    }
  });
});

app.get('/api/v1/deposits', function(req, res) {
  gateway.deposits.listQueued(function(err, deposits) {
    if (err) {
      res.send(500, { error: err });
    } else {
      res.send({ deposits:  deposits });
    }
  });
});

app.get('/api/v1/payments/outgoing', function(req, res) {
  gateway.payments.listOutgoing(function(err, payments) {
    if (err) {
      res.send(500, { error: err });
    } else {
      res.send({ payments: payments });
    }
  });
});

app.get('/api/v1/payments/incoming', function(req, res) {
  gateway.payments.listIncoming(function(err, payments) {
    if (err) {
      res.send(500, { error: err });
    } else {
      res.send({ payments: payments });
    }
  });
});

app.get('/api/v1/ripple_transactions/queued', function(req, res) {
  api.rippleTransactions.readAll({ transaction_state: "queued" }, function(err, transactions) {
    if (err) {
      res.send(500, { error: err });
    } else {
      res.send({ ripple_transactions:  transactions || [] });
    }
  }); 
});

app.get('/api/v1/ripple_transactions/queued', function(req, res) {
  api.rippleTransactions.readAll({ transaction_state: "queued" }, function(err, transactions) {
    if (err) {
      res.send(500, { error: err });
    } else {
      res.send({ ripple_transactions:  transactions || [] });
    }
  }); 
});

app.get('/ripple.txt', function(req, res) {
  res.set({ 'Content-Type': 'text/plain' });
  var rippleTxt = "";

  if (nconf.get('gateway_cold_wallet')) {
    rippleTxt += "[accounts]\n"+nconf.get('gateway_cold_wallet')+"\n\n";
  }

  if (nconf.get('gateway_hot_wallet') && nconf.get('gateway_hot_wallet').address) {
    rippleTxt += "[hotwallets]\n"+nconf.get('gateway_hot_wallet').address;
  }

  var currencies = nconf.get('currencies');
  if (currencies) {
    rippleTxt += "\n\n[currencies]\n";
    for (currency in nconf.get('currencies')) {
      rippleTxt += (currency+"\n\n");
    };
  }

  var domain = nconf.get('domain');
  if (domain) {
    rippleTxt += ('[domain]\n'+domain+'\n\n');
  }

  res.send(rippleTxt);
});

app.get('/api/v1/currencies', function(req, res) {
  var currencies = [];
  for (currency in nconf.get('currencies')) {
    currencies.push(currency);
  };
  res.send({ currencies: currencies });
});

app.get('/api/v1/users', function(req, res) {
  abstract.getUserAccounts(function(err, users) {
    if (err) { res.send(500, { error: err }); return; }
    res.send({ users: users });
  });
});

app.post('/api/v1/users/login', function(req, res) {
  api.users.read({ name: req.body.name }, function(err, user) {
    if (err) { res.send(500, { error: err }); return }
    var verified = api.users.verifyPassword(req.body.password, user.salt, user.password_hash);
    if (verified) {
      res.send({ user: user });
    } else {
      res.send(401);
    }
  });
});

app.get('/api/v1/withdrawals', function(req, res) {
  api.externalTransactions.readAllPending(function(err, withdrawals){
    if (err) { res.send(500, { error: err }); return; }
    res.send({ withdrawals: withdrawals });
  });
});

app.post('/api/v1/withdrawals/:id/clear', function(req, res) {
  abstract.clearWithdrawal(req.params.id, function(err, withdrawal) {
    if (err) { res.send(500, { error: err }); return; }
    res.send({ withdrawal: withdrawal });
  });
});

app.get('/api/v1/ripple_addresses', function(req, res) {
  api.rippleAddresses.readAll({}, function(err, addresses) {
    if (err) { res.send(500, { error: err }); return; }
    res.send({ ripple_addresses: addresses });
  });
});

app.get('/api/v1/users/:id/external_accounts', function(req, res) {
  api.externalAccounts.readAll({ user_id: req.params.id }, function(err, accounts) {
    if (err) { res.send(500, { error: err }); return; }
    res.send({ ripple_accounts: accounts });
  });
})

app.get('/api/v1/users/:id/ripple_addresses', function(req, res) {
  api.rippleAddresses.readAll({ user_id: req.params.id }, function(err, accounts) {
    if (err) { res.send(500, { error: err }); return; }
    res.send({ ripple_accounts: accounts });
  });
})

app.get('/api/v1/external_accounts', function(req, res) {
  api.externalAccounts.readAll({}, function(err, accounts) {
    if (err) { res.send(500, { error: err }); return; }
    res.send({ ripple_accounts: accounts });
  });
});


var ssl = (nconf.get('SSL') && (nconf.get('SSL') != 'false'));

if (ssl) {
  app = https.createServer({
    key: fs.readFileSync('../certs/server.key'),
    cert: fs.readFileSync('../certs/server.crt')
  }, app);
}

var host = nconf.get('HOST');
var port = nconf.get('PORT'); 
var protocol = ssl ? 'https' : 'http'

app.listen(port, host);



console.log('Serving REST API and Angular WebApp at '+protocol+'://'+host+':'+port);
