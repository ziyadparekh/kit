'use strict';

const express = require('express');
const ParseServer = require('parse-server').ParseServer;
const path = require('path');
const config = require('./configs/config');

const databaseUri = process.env.DATABASE_URI || 
                    process.env.MONGODB_URI ||
                    config.databaseUri;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

const api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || config.cloudCode,
  appId: process.env.APP_ID || config.appId,
  masterKey: process.env.MASTER_KEY || config.masterKey, //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || config.serverURL,  // Don't forget to change to https if needed
  liveQuery: config.liveQuery,
  allowClientClassCreation: config.allowClientClassCreation,
  enableAnonymousUsers: config.enableAnonymousUsers
});

const app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
const mountPath = process.env.PARSE_MOUNT || config.mountPath;
app.use(mountPath, api);

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/index.html'))
});

const port = process.env.PORT || config.port;
const httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('spice running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
