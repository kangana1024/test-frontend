import { USER_LOGIN_FAIL, USER_LOGIN_SUCCESS, USER_LOGOUT } from '../types';

const initState = {
  token: {
    atoken: '',
  },
};
export default (state = initState, action) => {
  switch (action.type) {
    case USER_LOGIN_FAIL:
      return {
        ...state,
        token: {
          atoken: '',
        },
      };
    case USER_LOGIN_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
      };
    case USER_LOGOUT:
      return {
        ...state,
        token: {
          atoken: '',
        },
      };
    default:
      return state;
  }
};
