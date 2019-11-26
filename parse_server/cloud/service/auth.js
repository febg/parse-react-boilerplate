module.exports.signIn = async (request) => {
  let data = request.params;
  // TODO: Look into sessions
  if (!data.email || !data.password) { throw new Error('Username or password not provided'); }
  const user = await Parse.User.logIn(data.email, data.password);
  return user;
};

module.exports.signUp = async (request) => {
  let data = request.params;
  // TODO: Look into sessions
  const user = new Parse.User();
  user.set('username', data.email);
  // Password is encrypted before being stored using bcrypt
  user.set('password', data.password);
  user.set('email', data.email);
  const newUser = await user.signUp();
  return newUser;
};

module.exports.resetPassword = async (request) => {
  let data = request.params;
  if (!data.email) { throw new Error('Email not provided'); }
  await Parse.User.requestPasswordReset(data.email);
  return 'OK';
};

module.exports.resendEmailVerification = async (request) => {
  const { user } = request;
  const token = user.getSessionToken(); // get session token from request.user

  if (!user) {
    throw new Error('INVALID_USER');
  }

  // TODO find a way to hit up the existing rest endpoint that does the same thing as this -.-
  const email = user.getEmail();
  const query = new Parse.Query(Parse.User).equalTo('objectId', user.id);

  const userObj = await query.first({ sessionToken: token });
  if (userObj == null) {
    throw new Error('INVALID_USER');
  }

  userObj.unset('email');
  const updatedObj = await userObj.save(null, { useMasterKey: true });
  updatedObj.set('email', email); // set email to trigger resend verify Email
  return updatedObj.save(null, { useMasterKey: true });
};
