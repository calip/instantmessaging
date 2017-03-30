process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var express = require('express')
var app = require('express')()
var websocket = require('socket.io');
var https = require('https');
var fs = require('fs');
var ip = require('ip');
rethinkdb = require('rethinkdb');
var compression = require('compression');
var ping = require('ping');
mongoDb = {};
remote_service = null;

var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
require('./waterlineHook')(mongoDb, require('./waterline-config').waterline);
//require('./printer')(fs);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(compression());

app.use('/', express.static('client'));

var httpsOptions = {
  key : fs.readFileSync(config.ssl.key),
  cert: fs.readFileSync(config.ssl.cert),
  ca: fs.readFileSync(config.ssl.ca),
  requestCert: false,
  rejectUnauthorized : false
};

var httpServer = https.createServer(httpsOptions,app);

var websocketServer = websocket(httpServer);

r = require('./rethinkHook')(config.rethink, websocketServer)

httpServer.listen(config.port, function () {
  console.log('listening on *:' + config.port);
  var service = require('./serviceauth');
  var api = require('./controllerHook')(mongoDb,httpServer,websocketServer,service,config);
  var methods = api.public;
  var restrictedMethods = api.restricted;
  methods.getOrigin = function (authServerUrl, remoteSocket, reqMsg, resCallback) {
    resCallback(false, config.hostname + ':' + config.port)
  };

  service.identify("radiogramServer", null, config.authServerUrl, function (isIdentifySuccess, identifyResp) {
    if (isIdentifySuccess === true) {
      console.log("authserver identifed, publicKey :");
      console.log(identifyResp);
      //todo: we should compare authserver publickey with the one we hold (trusted)

      service.initiateSession(config.authServerUrl, function (isInitiateSuccess, remoteService) {
        if (isInitiateSuccess === true) {
          console.log("service initiation success");

          //remote service will be available global
          remote_service = remoteService

          remoteService.subscribeOnApiAdded('webserver', 'attachscript', function () {
            remoteService.api.webserver.attachscript([
                {
                  src: 'https://'+ config.hostname + ':' + config.port + '/module_radiogram.js',
                  url: '/scripts/module/radiogram/module_radiogram.js'
                },
                {
                  src: 'https://'+ config.hostname + ':' + config.port + '/module_radiogram_statistic.js',
                  url: '/scripts/module/radiogram/module_radiogram_statistic.js'
                },
                {
                  src: 'https://'+ config.hostname + ':' + config.port + '/module_radiogram_kogas.js',
                  url: '/scripts/module/radiogram/module_radiogram_kogas.js'
                }
              ],
              function (isCallMethodSuccess, reply) {
                if (isCallMethodSuccess) {
                  console.log("webserver.attachscript() call success");
                }
              }
            );
          });

          remoteService.subscribeOnApiAdded('groupPolicyServer','policy_register', function () {
            remoteService.api.groupPolicyServer.policy_register(api.tokenList, function (data) {
              console.log('access token registered')
            })
          });

          remoteService.registerRestrictedApi(restrictedMethods, function (isRegisterSuccess, registeredMethods) {
            if (isRegisterSuccess) {
              registeredMethods.forEach(function (methodName) {
                console.log("registered restricted local method : " + methodName);
              });

              //api.init(httpRouter, webSocketServer, service, authServerUrl);
            }
            else {
              console.log("restricted api registration failed");
              console.log(registeredMethods);
            }
          });

          remoteService.registerApi(methods, function (isRegisterSuccess, registeredMethods) {
            if (isRegisterSuccess) {
              registeredMethods.forEach(function (methodName) {
                console.log("registered local method : " + methodName);
              });

              //api.init(app, io, service, config);
            }
            else {
              console.log("api registration failed");
              //console.log(registeredMethods);
            }
          });
        }
        else {
          console.log("service initiation failed");
          //console.log(remoteService);
        }
      });
    }
    else {
      console.log("authserver identify failed");
      console.log(identifyResp);
    }
  });
});
