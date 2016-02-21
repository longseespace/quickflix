/* @flow */
import hdviet from '../utils/hdviet'

// ------------------------------------
// Constants
// ------------------------------------
export const REQUEST_MOVIES = (tag): String => `@@${tag}/REQUEST_MOVIES`
export const RECEIVE_MOVIES = (tag): String => `@@${tag}/RECEIVE_MOVIES`
export const RECEIVE_ERRORS = (tag): String => `@@${tag}/RECEIVE_ERRORS`

// ------------------------------------
// Actions
// ------------------------------------
export const requestMovies = (tag): Action => ({
  type: REQUEST_MOVIES(tag)
})
export const receiveMovies = (tag, movies: Object): Action => ({
  type: RECEIVE_MOVIES(tag),
  payload: { movies }
})
export const receiveErrors = (tag, error: Error): Action => ({
  type: RECEIVE_ERRORS(tag),
  payload: { error }
})

// This is a thunk, meaning it is a function that immediately
// returns a function for lazy evaluation. It is incredibly useful for
// creating async actions, especially when combined with redux-thunk!
export function getMoviesByTag (tag: String = 'hot-trong-thang') {
  return (dispatch: Function, getState: Function): void => {
    const namespace = `tag:${tag}`
    if (getState()[namespace].isFetching) {
      return
    }
    if (!getState().auth.isAuthenticated) {
      // should dispatch an action that ask user to login
      return
    }
    const creds = getState().auth.creds
    const page = getState()[namespace].page + 1
    dispatch(requestMovies(tag))
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
            imdbRating: item.ImdbRating,
            bitrate: item.BitRate,
            season: item.Season,
            isTVSerie: item.Season > 0,
            episode: item.Episode,
            sequence: item.Sequence,
            poster: `http://t.hdviet.com/thumbs/124x184/${item.NewPoster}`,
            backdrop: `http://t.hdviet.com/backdrops/945x530/${item.Backdrop}`
          }
        })
      })
      .then((movies) => {
        dispatch(receiveMovies(tag, movies))
      })
      .catch((error) => {
        dispatch(receiveErrors(tag, error))
      })
  }
}

export const actions = {
  getMoviesByTag
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = (tag) => ({
  [REQUEST_MOVIES(tag)]: (state) => ({
    ...state,
    isFetching: true
  }),
  [RECEIVE_MOVIES(tag)]: (state, { payload }) => {
    const movies = []
    movies.push(...state.movies)
    movies.push(...payload.movies)
    const canLoadMore = payload.movies.length > 0
    return {
      ...state,
      page: state.page + 1,
      movies,
      canLoadMore,
      isFetching: false,
      hasError: false,
      error: {}
    }
  },
  [RECEIVE_ERRORS(tag)]: (state, { payload }) => ({
    ...state,
    isFetching: false,
    hasError: true,
    error: payload.error
  })
})

// ------------------------------------
// Reducer
// ------------------------------------
const INITIAL_STATE = {
  hasError: false,
  error: {},
  isFetching: false,
  page: 0,
  limit: 20,
  canLoadMore: true,
  movies: []
}

export function tagReducerCreator (tag: String) {
  return (state: Object = INITIAL_STATE, action: Action): Object => {
    const handler = ACTION_HANDLERS(tag)[action.type]
    return handler ? handler(state, action) : state
  }
}
