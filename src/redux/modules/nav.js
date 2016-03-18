/* @flow */
import hdviet from '../utils/hdviet'
import debounce from 'lodash.debounce'
import Movie from 'models/Movie'

// ------------------------------------
// Constants
// ------------------------------------
const API_REQUEST_DEBOUNCE_WAIT = 500

export const REQUEST_SUGGESTIONS = 'TOPNAV:REQUEST_SUGGESTIONS'
export const RECEIVE_SUGGESTIONS = 'TOPNAV:RECEIVE_SUGGESTIONS'
export const CLEAR_SUGGESTIONS = 'TOPNAV:CLEAR_SUGGESTIONS'
export const SHOW_SUGGESTIONS = 'TOPNAV:SHOW_SUGGESTIONS'
export const HIDE_SUGGESTIONS = 'TOPNAV:HIDE_SUGGESTIONS'
export const RECEIVE_ERRORS = 'TOPNAV:RECEIVE_ERRORS'
export const UPDATE_KEYWORD = 'TOPNAV:UPDATE_KEYWORD'

// ------------------------------------
// Actions
// ------------------------------------
export const requestSuggestions = (): Action => ({
  type: REQUEST_SUGGESTIONS
})
export const updateKeyword = (keyword: String): Action => ({
  type: UPDATE_KEYWORD,
  payload: { keyword }
})
export const receiveSuggestions = (suggestions: Array): Action => ({
  type: RECEIVE_SUGGESTIONS,
  payload: { suggestions }
})
export const clearSuggestions = (): Action => ({
  type: CLEAR_SUGGESTIONS
})
export const showSuggestions = (): Action => ({
  type: SHOW_SUGGESTIONS
})
export const hideSuggestions = (): Action => ({
  type: HIDE_SUGGESTIONS
})
export const receiveErrors = (error: Error): Action => ({
  type: RECEIVE_ERRORS,
  payload: { error }
})

const doFetch: Function = (dispatch: Function, getState: Function, keyword: String): Promise => {
  const creds = getState().auth.creds
  if (!creds.access_token) {
    return
  }
  dispatch(requestSuggestions())
  return hdviet.search(keyword, { accessToken: creds.access_token, limit: 5 })
    .then((data) => {
      return data.docs.map((item) => {
        return Movie.fromSearchResult(item)
      })
    })
    .then((movies: Array) => {
      const currentKeyword = getState().nav.keyword
      if (keyword === currentKeyword) {
        dispatch(receiveSuggestions(movies))
      } else {
        dispatch(clearSuggestions())
      }
    })
    .catch((error: Error) => {
      dispatch(receiveErrors(error.message))
    })
}

const debouncedFetch: Function = debounce(doFetch, API_REQUEST_DEBOUNCE_WAIT)

export function fetchSuggestions (keyword: String = '') {
  return (dispatch: Function, getState: Function): Promise => {
    return debouncedFetch(dispatch, getState, keyword)
  }
}

export const actions = {
  requestSuggestions,
  clearSuggestions,
  receiveSuggestions,
  fetchSuggestions,
  showSuggestions,
  hideSuggestions,
  updateKeyword
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [UPDATE_KEYWORD]: (state, { payload }) => ({
    ...state,
    ...payload
  }),
  [REQUEST_SUGGESTIONS]: (state) => ({
    ...state,
    requestId: state.requestId + 1,
    isFetching: true
  }),
  [CLEAR_SUGGESTIONS]: (state, { payload }) => ({
    ...state,
    ...payload,
    suggestions: [],
    isFetching: false
  }),
  [RECEIVE_SUGGESTIONS]: (state, { payload }) => ({
    ...state,
    ...payload,
    isFetching: false
  }),
  [SHOW_SUGGESTIONS]: (state) => ({
    ...state,
    isSuggestionsActive: true
  }),
  [HIDE_SUGGESTIONS]: (state) => ({
    ...state,
    isSuggestionsActive: false
  })
}

// ------------------------------------
// Reducer
// ------------------------------------
const INITIAL_STATE = {
  requestId: 0,
  keyword: '',
  isFetching: false,
  isSuggestionsActive: false,
  suggestions: []
}
export default function topnavReducer (state: Object = INITIAL_STATE, action: Action): Object {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
