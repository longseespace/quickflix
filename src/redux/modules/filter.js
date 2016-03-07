/* @flow */
import hdviet from '../utils/hdviet'
import Movie from 'models/Movie'
import isEqual from 'lodash.isequal'

// ------------------------------------
// Constants
// ------------------------------------
export const REQUEST_MOVIES = '@@filter/REQUEST_MOVIES'
export const CLEAR_RESULTS = '@@filter/CLEAR_RESULTS'
export const RECEIVE_MOVIES = '@@filter/RECEIVE_MOVIES'
export const RECEIVE_ERRORS = '@@filter/RECEIVE_ERRORS'

// ------------------------------------
// Actions
// ------------------------------------
export const requestMovies = (filters: Object): Action => ({
  type: REQUEST_MOVIES,
  payload: { filters }
})
export const clear = (): Action => ({
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
export function getMovies (filters) {
  return (dispatch: Function, getState: Function): Promise => {
    if (getState().filter.status === 'loading') {
      return
    }
    if (!isEqual(getState().filter.filters, filters)) {
      dispatch(clear())
    }
    const creds = getState().auth.creds
    if (!creds.access_token) {
      return
    }
    // after dispatching `clearResults()` we got new state
    const page = getState().filter.page + 1
    dispatch(requestMovies(filters))
    return hdviet.getMovies({ accessToken: creds.access_token, page, ...filters })
      .then((data) => {
        return data.lists.map((item) => {
          return Movie.fromFilterResult(item)
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
  getMovies
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
    return {
      ...state,
      page: state.page + 1,
      movies,
      status: 'loaded',
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
  error: {},
  status: 'init', // ['init', 'loading', 'loaded', 'error']
  page: 0,
  limit: 20,
  filters: {},
  movies: []
}
export default function searchReducer (state: Object = INITIAL_STATE, action: Action): Object {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
