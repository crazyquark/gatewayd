
module.exports = function(gatewayd) {
  //  ADD PLUGINS HERE, SUCH AS SETUP WIZARD
  const WizardPlugin = require('gatewayd-setup-wizard-plugin');
  var wizardPlugin = new WizardPlugin({
     gatewayd: gatewayd
  });
  gatewayd.server.use('/', wizardPlugin.router);
}

