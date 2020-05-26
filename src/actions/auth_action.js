import { USER_LOGIN_SUCCESS, USER_LOGIN_FAIL } from '../types';
import { authApi } from '../configs/api';
export const userlogin = (userdata, callback) => async (dispatch) => {
  try {
    let token = await localStorage.getItem('user_token');
    if (token) {
      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: JSON.parse(token),
      });
      callback('success');
    } else {
      //await doEmailLogin(userdata, dispatch);
      let email_auth = await userIsLogin(userdata);
      console.log(email_auth);
      if (email_auth.statusCode) {
        dispatch({
          type: USER_LOGIN_FAIL,
        });
        callback('fail');
        return;
      }
      if (email_auth.accessToken) {
        //await sendFCMToken(email_auth.access_token);
        await localStorage.setItem(
          'user_token',
          JSON.stringify({
            atoken: email_auth.accessToken,
          }),
        );
        dispatch({
          type: USER_LOGIN_SUCCESS,
          payload: {
            token: {
              atoken: email_auth.accessToken,
            },
          },
        });
        callback('success');
      } else {
        dispatch({
          type: USER_LOGIN_FAIL,
        });
        callback('fail');
      }
    }
  } catch (error) {
    callback('fail');
    console.log(error);
  }
  return;
};
const userIsLogin = async (uData) => {
  try {
    let response = await fetch(authApi, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(uData),
    });
    let resjson = await response.json();
    return resjson;
  } catch (error) {
    //console.log(error);
    return {
      errors: error,
    };
  }
};
export const isLogin = (callback) => async (dispatch) => {
  try {
    let token = await localStorage.getItem('user_token');
    console.log(JSON.parse(token));
    if (token) {
      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: {
          token: JSON.parse(token),
        },
      });
      callback('success');
    } else {
      dispatch({
        type: USER_LOGIN_FAIL,
      });
      callback('fail');
    }
  } catch (error) {
    console.log(error);
    dispatch({
      type: USER_LOGIN_FAIL,
    });
    callback('refresh');
  }
};
