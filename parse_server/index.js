import express from 'express';
import { ParseServer } from 'parse-server';
import logz from './utils/logz/logz';
import { Parse } from 'parse/node';
// Load env
const {
  APP_ID,
  MASTER_KEY,
  DATABASE_URI,
  SERVER_PORT,
  SERVER_URL,
  JAVASCRIPT_KEY
} = process.env;

logz.log('Setting up database conenction...');

// Database setup
// TODO: Remove local dev db url when prod ready
const databaseUri = DATABASE_URI || 'mongodb://mongo:27017/dev';
if (!databaseUri) {
  throw new Error('No database url');
}
logz.log('Configuring Parse server');
// Parse Server setup
const parseApi = new ParseServer({
  databaseURI: databaseUri,
  cloud: `${__dirname}/cloud/main.js`,
  appId: APP_ID || 'GenericAppId',
  appName: 'AppName',
  masterKey: MASTER_KEY || 'GenericMasterKey',
  javascriptKey: JAVASCRIPT_KEY || 'javascriptKey',
  allowClientClassCreation: false,
  serverURL: SERVER_URL || 'http://localhost:1337/parse',
  liveQuery: {
    classNames: ['Messages'], // List of classes to support for query subscriptions
  },
  startLiveQueryServer: true,
  verifyUserEmails: true,
  publicServerURL: SERVER_URL || 'http://localhost:1337/parse',
  emailVerifyTokenValidityDuration: 2 * 60 * 60, // 2 hours
  preventLoginWithUnverifiedEmail: false,
  emailAdapter: {
    module: '@parse/simple-mailgun-adapter',
    options: {
      // The address that your emails come from
      fromAddress: 'parse@sandbox8a7f2777d4614765b22b39019df00dbf.mailgun.org',
      // Your domain from mailgun.com
      domain: 'sandbox8a7f2777d4614765b22b39019df00dbf.mailgun.org',
      // Your API key from mailgun.com
      apiKey: '0b4df0a425b64863db09e496356c5c85-816b23ef-b05f4d7e',
    },
  },
});

Parse.initialize(APP_ID, JAVASCRIPT_KEY);
Parse.serverURL = SERVER_URL;

// Express server setup
const app = express();
const port = SERVER_PORT || 1337;

// Routes

// Serve the Parse as middlewear of express server
const mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, parseApi);

// Standard express HTTP endpoints can be added outside of parse mount scope
app.get('/', (req, res) => {
  res.status(200).send('OK');
});

app.get('/callback', (req, res) => {
  let { 
    transaction_hash, 
    address, 
    confirmations,
    value,
  } = req.query
  console.log("GET", req.query);
  res.status(200).send("OK");
  Parse.Cloud.run("blockchainTransactionCallback", req.query)
})

// Wrapping it all up
const httpServer = require('http').createServer(app);

httpServer.listen(port, () => {
  logz.success(`Listening on ${port}`);
});

ParseServer.createLiveQueryServer(httpServer, {
  appId: APP_ID || 'GenericAppId',
  masterKey: MASTER_KEY || 'GenericMasterKey',
  serverURL: SERVER_URL || 'http://localhost:1337/parse',
  websocketTimeout: 10 * 1000,
  cacheTimeout: 60 * 600 * 1000,
});
