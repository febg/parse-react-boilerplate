import { Parse } from 'parse';

const Message = Parse.Object.extend('Messages');
export default Message;

export const MessagePointer = (objectId) => ({
  __type: 'Pointer',
  className: 'Messages',
  objectId,
});
