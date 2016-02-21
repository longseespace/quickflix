/* @flow */
import hdviet from '../utils/hdviet'

// ------------------------------------
// Constants
// ------------------------------------
export const REQUEST_MOVIES = 'HOME:REQUEST_MOVIES'
export const RECEIVE_MOVIES = 'HOME:RECEIVE_MOVIES'
export const RECEIVE_ERRORS = 'HOME:RECEIVE_ERRORS'

// ------------------------------------
// Actions
// ------------------------------------
export const requestMovies = (): Action => ({
  type: REQUEST_MOVIES
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
export function getMoviesByTag (tag: String = 'hot-trong-thang') {
  return (dispatch: Function, getState: Function): void => {
    if (getState().home.isFetching) {
      return
    }
    if (!getState().auth.isAuthenticated) {
      // should dispatch an action that ask user to login
      return
    }
    const creds = getState().auth.creds
    const page = getState().home.page + 1
    dispatch(requestMovies())
    hdviet.getMoviesByTag(tag, { accessToken: creds.access_token, page })
      .then((data) => {
        return data.lists.map((item) => {
          return {
            id: item.MovieID,
            name: {
              en: item.MovieName,
              vi: item.KnownAs
            },
            trailer: item.Trailer,
            releaseDate: item.ReleaseDate,
            plot: {
              vi: item.PlotVI,
              en: item.PlotEN
            },
            director: item.Director,
            imdbRating: +item.ImdbRating,
            poster: `http://t.hdviet.com/thumbs/124x184/${item.NewPoster}`,
            backdrop: `http://t.hdviet.com/backdrops/945x530/${item.Backdrop}`,
            bitrate: item.BitRate,
            season: +item.Season,
            isTVSerie: item.Season > 0,
            episode: +item.Episode,
            sequence: +item.Sequence
          }
        })
      })
      .then((movies) => {
        dispatch(receiveMovies(movies))
      })
  }
}

export function getHomeMovies () {
  return getMoviesByTag('moi-cap-nhat', ...arguments)
}

export const actions = {
  getHomeMovies
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [REQUEST_MOVIES]: (state) => ({ ...state, isFetching: true }),
  [RECEIVE_MOVIES]: (state, { payload }) => {
    const movies = []
    movies.push(...state.movies)
    movies.push(...payload.movies)
    return {
      ...state,
      page: state.page + 1,
      movies,
      isFetching: false,
      hasError: false,
      error: {}
    }
  },
  [RECEIVE_ERRORS]: (state, { payload }) => ({
    ...state,
    isFetching: false,
    hasError: true,
    error: payload.error
  })
}

// ------------------------------------
// Reducer
// ------------------------------------
const INITIAL_STATE = {
  hasError: false,
  error: {},
  isFetching: false,
  page: 0,
  limit: 20,
  movies: []
}

export default function homeReducer (state: Object = INITIAL_STATE, action: Action): Object {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
