
import * as auth from './service/auth';
import * as blockchain from './service/blockchain/blockchain';
import * as transactions from './service/transactions'
// In order to follow test driven development, the logic of these cloud
// endpoints has been abstracted to indiviual handlers.

// TODO: Fix linter for this file. I'm not sure how `Parse` gets defined but it somehow does
// from new ParseServer(...)

// [ Generic App Endpoints ]
Parse.Cloud.onLiveQueryEvent(({
  event, clients, subscriptions, sessionToken, useMasterKey, installationId,
}) => {
  console.log(`Live Query Event\nEventType: ${event} Clients: ${clients} Subscriptions: `, `${subscriptions} SessionToken: `, `${sessionToken} Uses Master Key: `, `${useMasterKey} InstallationId: `, `${installationId}\n`);
});

const endpointFunctionMap = {
  signup: auth.signUp,
  signin: auth.signIn,
  resetPassword: auth.resetPassword,
  resendEmailVerification: auth.resendEmailVerification,
  getReceiveAddress: transactions.getReceiveAddress,
  blockchainTransactionCallback: blockchain.blockchainTransactionCallback,
};

Object.keys(endpointFunctionMap).forEach((endpoint) => {
  Parse.Cloud.define(endpoint, async (req) => {
    const func = endpointFunctionMap[endpoint];
    try {
      const data = await func(req);
      return { data, isSuccess: true };
    } catch (error) {
      console.log(error);
      console.log("Catch 1")
      return error;
    }
  });
});
