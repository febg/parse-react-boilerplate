const axios = require('axios');

const url = 'https://api.blockchain.info/v2/receive';

const xpubs = [
  'xpub6CdikVS6i9Z4k5XxY7WZp4zFfR6hHg1BC5mCk6mXFyT92U6TMLhP9ezRfMb2D6LBKgKjqjMLD4Up94LPN8saVPNW53Ka7dtkynCwCHebGp6',
];

module.exports.generateReceiveAddress = async () => {
  console.log('Generating address');

  const secret = 'HASH';
  const xpub = await getAvailableXpub();
  console.log('awa', xpub);
  // TODO: Load from env
  const key = '22f1e726-82d1-463a-8e62-59ec37491e44';
  // TODO: Load from env
  const callback = encodeURIComponent('https://1d7cf025.ngrok.io/callback');
  console.log('callback', callback);
  const parameters = {
    key,
    xpub,
  };
  console.log('Generating request');
  try {
    const response = await axios.get(`${url}?callback=${callback}`, {
      params: parameters,
    });
    console.log('RESPONSE');
    console.log(response.data);
    return response.data;
  } catch (error) {
    // TODO: Handle unused address limit, change xpub and retry
    console.log(error.response);
    throw error.response.data;
  }
};

let getAvailableXpub = async () => {
  console.log('Genrating xpubs');
  for (xpub of xpubs) {
    console.log('xpub', xpub);
    const addressGap = await checkXpubAddressGap(xpub);
    console.log('response', addressGap.gap);
    if (addressGap.gap < 20) {
      console.log('returning');
      return xpub;
    }
    console.log('ELSE');
  }
};


const requestBalanceUpdates = async (address) => {
  console.log('Calling balance updates');
  const callback = '';
  const key = '22f1e726-82d1-463a-8e62-59ec37491e44';
  const onNotification = '';
  const confs = '';
  const op = '';

  const parameters = {
    address,
    callback,
    key,
    onNotification,
    confs,
    op,
  };

  console.log('Making request 2');

  try {
    const response = await axios.post(`${url}/balance_update`, parameters);
    console.log('RESPONSE 2');
    console.log(response);
  } catch (error) {
    console.log('ERROR 2');
    console.log(error);
  }
};

// TODO: add function to delete request for balance update

const requestBlockUpdates = async () => {
  console.log('Calling block updates');
  const callback = '';
  const key = '22f1e726-82d1-463a-8e62-59ec37491e44';
  const onNotification = '';
  const confs = '';
  const heights = '';

  const parameters = {
    address,
    callback,
    key,
    onNotification,
    confs,
    heights,
  };

  console.log('Making request 3');

  try {
    const response = await axios.post(`${url}/block_notification`, parameters);
    console.log('RESPONSE 3');
    console.log(response);
  } catch (error) {
    console.log('ERROR 3');
    console.log(error);
  }
};

// TODO: add function to delete request to block

let checkXpubAddressGap = async (xpub) => {
  const key = '22f1e726-82d1-463a-8e62-59ec37491e44';

  const parameters = {
    xpub,
    key,
  };

  try {
    const response = await axios.get(`${url}/checkgap`, {
      params: parameters,
    });
    return response.data;
  } catch (error) {
    console.log('ERROR 4');
    console.log(error.response.data);
  }
};

module.exports.blockchainTransactionCallback = async (request) => {
  const {
    address,
    confirmations,
    value,
  } = request.params;
  const transactionHash = request.params.transaction_hash;
  // TODO: Secret value to verify callback

  console.log('\n\nP', transactionHash, address, confirmations, value);

  // Find address owner
  const queryReceiveAddress = new Parse.Query(Parse.Object.extend('ReceiveAddresses'));
  queryReceiveAddress.equalTo('address', address);
  const receiveAddress = await queryReceiveAddress.first({ useMasterKey: true });

  if (receiveAddress == null) {
    throw new Error('INVALID RECEIVE ADDRESS');
  }

  const userId = receiveAddress.get('userId');

  // Find transaction using transaction address
  const queryTransactions = new Parse.Query(Parse.Object.extend('Transactions'));
  queryTransactions.equalTo('address', address);
  queryTransactions.equalTo('hash', transactionHash);
  queryTransactions.equalTo('userId', userId);
  queryTransactions.equalTo('value', parseInt(value, 10));

  let transaction = await queryTransactions.first({ useMasterKey: true });

  if (transaction == null) {
    const Transactions = Parse.Object.extend('Transactions');
    transaction = new Transactions();
    transaction.set('address', address);
    transaction.set('hash', transactionHash);
    transaction.set('userId', userId);
    transaction.set('value', parseInt(value, 10));
  }

  transaction.set('confirmations', parseInt(confirmations, 10));
  await transaction.save();
  // TODO: Add credit to user balance
  return 'OK';
};
