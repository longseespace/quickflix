/* @flow */
import hdviet from '../utils/hdviet'

// ------------------------------------
// Constants
// ------------------------------------
export const REQUEST_MOVIES = 'MOVIE:REQUEST_MOVIES'
export const CLEAR_MOVIES = 'MOVIE:CLEAR_MOVIES'
export const RECEIVE_MOVIES = 'MOVIE:RECEIVE_MOVIES'
export const RECEIVE_ERRORS = 'MOVIE:RECEIVE_ERRORS'

// ------------------------------------
// Actions
// ------------------------------------
export const requestMovies = (): Action => ({
  type: REQUEST_MOVIES
})
export const clearMovies = (): Action => ({
  type: CLEAR_MOVIES
})
export const receiveMovies = (movie: Object): Action => ({
  type: RECEIVE_MOVIES,
  payload: { movie }
})
export const receiveErrors = (error: Error): Action => ({
  type: RECEIVE_ERRORS,
  payload: { error }
})

// This is a thunk, meaning it is a function that immediately
// returns a function for lazy evaluation. It is incredibly useful for
// creating async actions, especially when combined with redux-thunk!
export function getMovie (id, episode) {
  return async (dispatch: Function, getState: Function): void => {
    if (getState().movie.isFetching) {
      return
    }
    if (!getState().auth.isAuthenticated) {
      // should dispatch an action that ask user to login
      return
    }
    const creds = getState().auth.creds
    dispatch(requestMovies())
    try {
      let sequence = episode || 0
      const movie = await hdviet.getMovie(id, { sequence, accessToken: creds.access_token })
        .then((data) => ({
          overview: data.movie,
          seasons: data.seasons,
          detail: data.infoMovie
        }))
      if (movie.seasons.length > 0 && sequence === 0) {
        sequence = 1
      }
      movie.playlist = await hdviet.getPlaylist(id, { sequence, accessToken: creds.access_token })
      dispatch(receiveMovies(movie))
    } catch (error) {
      dispatch(receiveErrors(error))
    }
  }
}

export function clear () {
  return (dispatch: Function): void => {
    dispatch(clearMovies())
  }
}

export const actions = {
  getMovie,
  clear,
  clearMovie: clearMovies
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [REQUEST_MOVIES]: (state, { payload }) => ({
    ...state,
    ...payload,
    isFetching: true,
    isFetched: false
  }),
  [CLEAR_MOVIES]: (state) => ({
    ...state,
    isFetching: false,
    isFetched: false,
    movie: {}
  }),
  [RECEIVE_MOVIES]: (state, { payload }) => ({
    ...state,
    ...payload,
    isFetching: false,
    error: false,
    errorMessage: '',
    isFetched: true
  }),
  [RECEIVE_ERRORS]: (state, { payload }) => ({
    ...state,
    isFetching: false,
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
  isFetched: false,
  movie: {}
}
export default function movieReducer (state: Object = INITIAL_STATE, action: Action): Object {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
