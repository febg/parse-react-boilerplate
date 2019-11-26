import { Parse } from 'parse';

let clientPromise;
Parse.initialize(
  process.env.REACT_APP_PARSE_APP_ID,
  process.env.REACT_APP_PARSE_JS_KEY,
);
// javascriptKey is required only if you have it on server.
Parse.serverURL = process.env.REACT_APP_PARSE_HTTP_URL;

// Get an already opened and initialized Parse client
export const getClient = async () => {
  if (clientPromise == null) {
    clientPromise = new Promise(async (resolve) => {
      const client = new Parse.LiveQueryClient({
        applicationId: process.env.REACT_APP_PARSE_APP_ID,
        serverURL: process.env.REACT_APP_PARSE_WS_URL,
        javascriptKey: process.env.REACT_APP_PARSE_JS_KEY,
      });
      await client.open();
      resolve(client);
    });
  }
  const client = await clientPromise;
  return client;
};

const transformAPIResponse = (resp) => {
  if (!resp.isSuccess) {
    if (typeof resp === 'string') {
      return { data: null, apiError: { message: resp } };
    }
    return { data: null, apiError: resp };
  }
  return { data: resp.data, apiError: null };
};

export const apiCallify = (asyncApiFunc) => async (...args) => {
  await getClient(); // Make sure the client is initialized
  const resp = await asyncApiFunc(...args);
  return transformAPIResponse(resp);
};
