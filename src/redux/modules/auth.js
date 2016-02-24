/* @flow */
import hdviet from 'redux/utils/hdviet'

// ------------------------------------
// Constants
// ------------------------------------
export const STORAGE_KEY = 'auth'
export const LOGIN = 'AUTH:LOGIN'
export const LOGOUT = 'AUTH:LOGOUT'
export const RECEIVE_TOKENS = 'AUTH:RECEIVE_TOKENS'
export const RECEIVE_ERRORS = 'AUTH:RECEIVE_ERRORS'
export const PERSIST_CREDS = 'AUTH:PERSIST_CREDS'
export const REMOVE_CREDS = 'AUTH:REMOVE_CREDS'

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
    return hdviet.login(email, password, key, captcha)
      .then((creds) => {
        dispatch(receiveTokens(creds))
      })
      .catch((error) => {
        dispatch(receiveErrors(error))
      })
  }
}

export function logout () {
  return (dispatch: Function): void => {
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
  [LOGOUT]: (state) => {
    localStorage.removeItem(STORAGE_KEY)
    return {
      ...state,
      isFetching: false,
      isAuthenticated: false,
      creds: {}
    }
  },
  [RECEIVE_TOKENS]: (state, { payload }) => {
    const creds = payload.creds
    localStorage.setItem(STORAGE_KEY, JSON.stringify(creds))
    return {
      ...state,
      creds,
      isFetching: false,
      isAuthenticated: true,
      hasError: false
    }
  },
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
const persistedCreds = localStorage.getItem(STORAGE_KEY)
const INITIAL_STATE = {
  hasError: false,
  error: {},
  isFetching: false,
  isAuthenticated: persistedCreds !== null && persistedCreds.length > 0,
  creds: persistedCreds && persistedCreds.length > 0 ? JSON.parse(persistedCreds) : {}
}

export default function authReducer (state: Object = INITIAL_STATE, action: Action): Object {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
