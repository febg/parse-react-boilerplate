import { Parse } from 'parse';
import { apiCallify } from './utils';

export const signUp = apiCallify(async (data) => {
  const payload = {
    email: data.email,
    password: data.password,
  };
  const user = await Parse.Cloud.run('signup', payload);
  return user;
});

export const signIn = apiCallify(async (user) => {
  const payload = {
    email: user.email,
    password: user.password,
  };
  const session = await Parse.Cloud.run('signin', payload);
  return session;
});

export const resetPassword = apiCallify(async (email) => {
  const payload = {
    email,
  };
  const confirmation = await Parse.Cloud.run('resetPassword', payload);
  return confirmation;
});

// Uses logged in user
export const resendEmailVerification = apiCallify(async () => {
  const confirmation = await Parse.Cloud.run('getReceiveAddress');
  return confirmation;
});
