var Promise    = require('bluebird');
var pm2        = require('pm2');
pm2.connect    = Promise.promisify(pm2.connect);
pm2.disconnect = Promise.promisify(pm2.disconnect);
pm2.start      = Promise.promisify(pm2.start);
pm2.kill       = Promise.promisify(pm2.killDaemon);

var config = require(__dirname+'/../../config/environment.js')
var logger  = require(__dirname+'/../../lib/data/logs.js');

var processSet = require(__dirname+'/index.js');

function parseNameFromPath(path) {
  return 'gatewayd:'+path.split('/').pop().replace('.js', '');
}

function Supervisor() {}

Supervisor.prototype.start = function() {
  return new Promise(function(resolve, reject) {
    var processes;
    var debug = config.get('NODE_DEBUG');
    var processNum = 0;
    
    return pm2.connect()
      .then(function() {
        return Promise.map(processSet.toArray(), function(path) {
          var processName = parseNameFromPath(path);
          
          var args = { 
            name: processName,
          };
          
          // If we want to debug, 
          // start each process with its own debugger on ports 5858, 6868, 7878, 8888, 9898 etc
          if (debug) {
            var debugPort = 5858 + processNum * 1010;
            args.nodeArgs = ['--debug=' + debugPort];
            processNum++;
            
            logger.warn('[DEBUG]Starting ' + processName + ' in debug mode, port: ' + debugPort);
          }
          
          return pm2.start(path, args);
        });
      })
      .then(function(started) {
        processes = started;
        //logger.info(started[0]);
        return pm2.list();
      })
      .then(function() {
        resolve(processes);
      })
      .error(function(error) {
        pm2.disconnect().then(function() {
          reject(error);
        })
        .error(reject);
      });
  });
};

Supervisor.prototype.stop = function() {
  return pm2.connect()
    .then(function() {
      return pm2.kill();
    }).then(function() {
      return pm2.disconnect(process.exit(0));
    });
};

module.exports = Supervisor;

