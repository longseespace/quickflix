/* @flow */
import hdviet from '../utils/hdviet'
import Movie from 'models/Movie'

// ------------------------------------
// Constants
// ------------------------------------
export const REQUEST_MOVIES = 'SEARCH:REQUEST_MOVIES'
export const CLEAR_RESULTS = 'SEARCH:CLEAR_RESULTS'
export const RECEIVE_MOVIES = 'SEARCH:RECEIVE_MOVIES'
export const RECEIVE_ERRORS = 'SEARCH:RECEIVE_ERRORS'

// ------------------------------------
// Actions
// ------------------------------------
export const requestMovies = (keyword: String): Action => ({
  type: REQUEST_MOVIES,
  payload: { keyword }
})
export const clearResults = (): Action => ({
  type: CLEAR_RESULTS
})
export const receiveMovies = (movies: Object): Action => ({
  type: RECEIVE_MOVIES,
  payload: { movies }
})
export const receiveErrors = (error: Error): Action => ({
  type: RECEIVE_ERRORS,
  payload: { error }
})

// This is a thunk, meaning it is a function that immediately
// returns a function for lazy evaluation. It is incredibly useful for
// creating async actions, especially when combined with redux-thunk!
export function searchMovies (keyword) {
  return (dispatch: Function, getState: Function): Promise => {
    if (getState().search.isFetching) {
      return
    }
    if (getState().search.keyword !== keyword) {
      dispatch(clearResults())
    }
    const creds = getState().auth.creds
    if (!creds.access_token) {
      return
    }
    // after dispatching `clearResults()` we got new state
    const page = getState().search.page + 1
    dispatch(requestMovies(keyword))
    return hdviet.search(keyword, { accessToken: creds.access_token, page })
      .then((data) => {
        return data.docs.map((item) => {
          return Movie.fromSearchResult(item)
        })
      })
      .then((movies) => {
        dispatch(receiveMovies(movies))
      })
      .catch((error) => {
        dispatch(receiveErrors(error))
      })
  }
}

export const actions = {
  searchMovies
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [REQUEST_MOVIES]: (state, { payload }) => ({ ...state, ...payload, status: 'loading' }),
  [CLEAR_RESULTS]: (state) => ({ ...state, status: 'init', movies: [], page: 0 }),
  [RECEIVE_MOVIES]: (state, { payload }) => {
    const movies = []
    movies.push(...state.movies)
    movies.push(...payload.movies)
    const status = payload.movies.length === 0 ? 'fullyloaded' : 'loaded'
    return {
      ...state,
      page: state.page + 1,
      movies,
      status,
      error: {}
    }
  },
  [RECEIVE_ERRORS]: (state, { payload }) => ({
    ...state,
    status: 'error',
    error: payload.error
  })
}
// ------------------------------------
// Reducer
// ------------------------------------
const INITIAL_STATE = {
  keyword: '',
  status: 'init', // ['init', 'loading', 'loaded', 'fullyloaded', 'error']
  error: {},
  page: 0,
  limit: 20,
  movies: []
}
export default function searchReducer (state: Object = INITIAL_STATE, action: Action): Object {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
