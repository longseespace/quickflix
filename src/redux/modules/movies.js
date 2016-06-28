/* @flow */
import hdviet from '../utils/hdviet';
import Movie from 'models/Movie';

// ------------------------------------
// Constants
// ------------------------------------
export const REQUEST_MOVIES = '@@movies/REQUEST_MOVIES';
export const CLEAR_RESULTS = '@@movies/CLEAR_RESULTS';
export const RECEIVE_MOVIES = '@@movies/RECEIVE_MOVIES';
export const RECEIVE_ERRORS = '@@movies/RECEIVE_ERRORS';

// ------------------------------------
// Actions
// ------------------------------------
export const requestMovies = (): Action => ({
  type: REQUEST_MOVIES
});
export const clearResults = (): Action => ({
  type: CLEAR_RESULTS
});
export const receiveMovies = (query: Object, movies: Object): Action => ({
  type: RECEIVE_MOVIES,
  payload: { query, movies }
});
export const receiveErrors = (error: Error): Action => ({
  type: RECEIVE_ERRORS,
  payload: { error }
});

// This is a thunk, meaning it is a function that immediately
// returns a function for lazy evaluation. It is incredibly useful for
// creating async actions, especially when combined with redux-thunk!
export function getFavoriteMovies (query) {
  return (dispatch: Function, getState: Function): Promise => {
    if (getState().movies.status === 'loading') {
      return;
    }
    const creds = getState().auth.creds;
    if (!creds.access_token) {
      return;
    }
    dispatch(requestMovies());
    return hdviet.getFavoriteMovies({ accessToken: creds.access_token, page: query.page })
      .then((data) => {
        return data.lists.map((item) => {
          return Movie.fromfavoriteResult(item);
        });
      })
      .then((movies) => {
        dispatch(receiveMovies(query, movies));
      })
      .catch((error) => {
        dispatch(receiveErrors(error));
      });
  };
}

export function filterMovies (query) {
  return (dispatch: Function, getState: Function): Promise => {
    if (getState().movies.status === 'loading') {
      return;
    }
    const creds = getState().auth.creds;
    if (!creds.access_token) {
      return;
    }
    dispatch(requestMovies());
    const filters = {
      page: query.page,
      limit: query.limit,
      ...query.filters
    };
    return hdviet.getMovies({ accessToken: creds.access_token, ...filters })
      .then((data) => {
        return data.lists.map((item) => {
          return Movie.fromFilterResult(item);
        });
      })
      .then((movies) => {
        dispatch(receiveMovies(query, movies));
      })
      .catch((error) => {
        dispatch(receiveErrors(error));
      });
  };
}

export function clear () {
  return (dispatch: Function): Promise => {
    dispatch(clearResults());
  };
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [REQUEST_MOVIES]: (state) => ({
    ...state,
    status: 'loading'
  }),
  [CLEAR_RESULTS]: (state) => ({
    ...state,
    query: {
      ...state.query,
      limit: 24,
      page: 1
    },
    status: 'init',
    movies: []
  }),
  [RECEIVE_MOVIES]: (state, { payload }) => {
    const movies = [];
    movies.push(...state.movies);
    movies.push(...payload.movies);
    const status = payload.movies.length === 0 ? 'fullyloaded' : 'loaded';
    const { query } = payload;
    return {
      ...state,
      movies,
      query,
      status,
      error: {}
    };
  },
  [RECEIVE_ERRORS]: (state, { payload }) => ({
    ...state,
    status: 'error',
    error: payload.error
  })
};
// ------------------------------------
// Reducer
// ------------------------------------
const INITIAL_STATE = {
  error: {},
  query: {
    limit: 24,
    page: 1
  },
  status: 'init', // ['init', 'loading', 'loaded', 'fullyloaded', 'error']
  movies: []
};
export default function searchReducer (state: Object = INITIAL_STATE, action: Action): Object {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
