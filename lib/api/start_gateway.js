var path       = require('path');
var Supervisor = require(path.join(__dirname,'/../processes/supervisor'));

/**
 * @function startGateway
 * @requires GatewayProcessManager
 * @description Starts gateway processes.
 * @param opts
 */

function startGateway() {
  return new Supervisor().start();
}

module.exports = startGateway;

