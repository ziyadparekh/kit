'use strict';

module.exports = {
  databaseUri: 'mongodb://localhost:27017/prod',
  cloudCode: __dirname + '/../cloud/main.js',
  appId: 'myAppId',
  masterKey: 'myMasterKey',
  serverURL: 'http://localhost:1337/api',
  mountPath: '/api',
  liveQuery: {
    classNames: []
  },
  port: 3030,
  allowClientClassCreation: true,
  enableAnonymousUsers: true
};