import { createAction, handleActions } from 'redux-actions';
import hdviet from '../utils/hdviet';

// ------------------------------------
// Constants
// ------------------------------------
const STORAGE_KEY = 'auth';
export const LOGIN = 'AUTH:LOGIN';
export const LOGOUT = 'AUTH:LOGOUT';
export const RECEIVE_TOKENS = 'AUTH:RECEIVE_TOKENS';
export const RECEIVE_ERRORS = 'AUTH:RECEIVE_ERRORS';

// ------------------------------------
// Actions
// ------------------------------------
export const requestLogin = createAction(LOGIN);
export const requestLogout = createAction(LOGOUT);
export const receiveTokens = createAction(RECEIVE_TOKENS, (creds) => ({ creds }));
export const receiveErrors = createAction(RECEIVE_ERRORS, (error) => ({ error }));

// This is a thunk, meaning it is a function that immediately
// returns a function for lazy evaluation. It is incredibly useful for
// creating async actions, especially when combined with redux-thunk!
export function login(email, password, key, captcha) {
  return (dispatch, getState) => {
    if (getState().auth.isFetching) {
      return;
    }
    dispatch(requestLogin());
    hdviet.login(email, password, key, captcha)
      .then(creds => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(creds));
        dispatch(receiveTokens(creds));
      })
      .catch(error => {
        dispatch(receiveErrors(error));
      });
  };
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY);
  requestLogout();
}

export const actions = {
  login,
  logout,
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [LOGIN]: (state) => ({
    ...state,
    isFetching: true,
    isAuthenticated: false,
  }),
  [LOGOUT]: (state) => ({
    ...state,
    isFetching: false,
    isAuthenticated: false,
    creds: {},
  }),
  [RECEIVE_TOKENS]: (state, { payload }) => ({
    ...state,
    creds: payload.creds,
    isFetching: false,
    isAuthenticated: true,
    hasError: false,
  }),
  [RECEIVE_ERRORS]: (state, { payload }) => ({
    ...state,
    isFetching: false,
    isAuthenticated: false,
    hasError: true,
    error: payload.error.body,
  }),
}, {
  hasError: false,
  error: {},
  isFetching: false,
  isAuthenticated: localStorage.getItem(STORAGE_KEY) ? true : false,
  creds: localStorage.getItem(STORAGE_KEY) ? JSON.parse(localStorage.getItem(STORAGE_KEY)) : {},
});
