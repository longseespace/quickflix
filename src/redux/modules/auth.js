/* @flow */
import hdviet from '../utils/hdviet'

// ------------------------------------
// Constants
// ------------------------------------
const STORAGE_KEY = 'auth'
export const LOGIN = 'AUTH:LOGIN'
export const LOGOUT = 'AUTH:LOGOUT'
export const RECEIVE_TOKENS = 'AUTH:RECEIVE_TOKENS'
export const RECEIVE_ERRORS = 'AUTH:RECEIVE_ERRORS'

// ------------------------------------
// Actions
// ------------------------------------
export const requestLogin = (): Action => ({
  type: LOGIN
})
export const requestLogout = (): Action => ({
  type: LOGOUT
})
export const receiveTokens = (creds: Object): Action => ({
  type: RECEIVE_TOKENS,
  payload: { creds }
})
export const receiveErrors = (error: Error): Action => ({
  type: RECEIVE_ERRORS,
  payload: { error }
})

// This is a thunk, meaning it is a function that immediately
// returns a function for lazy evaluation. It is incredibly useful for
// creating async actions, especially when combined with redux-thunk!
export function login (email: String, password: String, key: String, captcha: String) {
  return (dispatch: Function, getState: Function): void => {
    if (getState().auth.isFetching) {
      return
    }
    dispatch(requestLogin())
    hdviet.login(email, password, key, captcha)
      .then((creds) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(creds))
        dispatch(receiveTokens(creds))
      })
      .catch((error) => {
        dispatch(receiveErrors(error))
      })
  }
}

export function logout () {
  return (dispatch: Function): void => {
    localStorage.removeItem(STORAGE_KEY)
    dispatch(requestLogout())
  }
}

export const actions = {
  login,
  logout
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [LOGIN]: (state) => ({
    ...state,
    isFetching: true,
    isAuthenticated: false
  }),
  [LOGOUT]: (state) => ({
    ...state,
    isFetching: false,
    isAuthenticated: false,
    creds: {}
  }),
  [RECEIVE_TOKENS]: (state, { payload }) => ({
    ...state,
    creds: payload.creds,
    isFetching: false,
    isAuthenticated: true,
    hasError: false
  }),
  [RECEIVE_ERRORS]: (state, { payload }) => ({
    ...state,
    isFetching: false,
    isAuthenticated: false,
    hasError: true,
    error: payload.error.body
  })
}

// ------------------------------------
// Reducer
// ------------------------------------
const INITIAL_STATE = {
  hasError: false,
  error: {},
  isFetching: false,
  isAuthenticated: localStorage.getItem(STORAGE_KEY),
  creds: localStorage.getItem(STORAGE_KEY) ? JSON.parse(localStorage.getItem(STORAGE_KEY)) : {}
}

export default function authReducer (state: Object = INITIAL_STATE, action: Action): Object {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
