import { SET_ME } from './actions';

const INITIAL_STATE = {
  me: null,
};

export default function authReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_ME:
      return { ...state, me: action.user };
    default:
      return state;
  }
}
