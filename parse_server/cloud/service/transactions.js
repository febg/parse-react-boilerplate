const blockchain = require('./blockchain/blockchain');

module.exports.getReceiveAddress = async (request) => {
  const { user } = request;

  if (!user) {
    throw new Error('INVALID_USER');
  }

  const token = user.getSessionToken();
  console.log('\n\nTOKEEEN', token, user);
  // Check if user has already an existing address
  // Not sure if user can reuse address or if every transaction requires a new address

  const queryReceiveAddress = new Parse.Query(Parse.Object.extend('ReceiveAddresses'));
  queryReceiveAddress.equalTo('userId', user.id);
  let receiveAddress = await queryReceiveAddress.first({ sessionToken: token });
  console.log('Serch', receiveAddress);
  if (receiveAddress != null) {
    return receiveAddress.get('address');
  }

  let address;

  try {
    address = await blockchain.generateReceiveAddress();
  } catch (error) {
    throw new Error('Unable to generate address');
  }
  console.log('got', address);
  const ReceiveAddresses = Parse.Object.extend('ReceiveAddresses');
  receiveAddress = new ReceiveAddresses();
  receiveAddress.set('address', address.address);
  receiveAddress.set('callback', address.callback);
  receiveAddress.set('userId', user.id);
  receiveAddress.set('isConfirmed', false);

  // Set ACL's

  const acl = new Parse.ACL();

  acl.setPublicReadAccess(false);
  acl.setPublicWriteAccess(false);
  acl.setReadAccess(user.id, true);
  acl.setWriteAccess(user.id, false);

  receiveAddress.setACL(acl);

  await receiveAddress.save(null, { sessionToken: token });

  return { address: address.address };
}
;