import { createAction, handleActions } from 'redux-actions';
import hdviet from '../utils/hdviet';

// ------------------------------------
// Constants
// ------------------------------------
export const REQUEST_MOVIES = 'HOME:REQUEST_MOVIES';
export const RECEIVE_MOVIES = 'HOME:RECEIVE_MOVIES';
export const RECEIVE_ERRORS = 'HOME:RECEIVE_ERRORS';

// ------------------------------------
// Actions
// ------------------------------------
export const requestMovies = createAction(REQUEST_MOVIES);
export const receiveMovies = createAction(RECEIVE_MOVIES, (movies) => ({ movies }));
export const receiveErrors = createAction(RECEIVE_ERRORS, (message) => ({ message }));

// This is a thunk, meaning it is a function that immediately
// returns a function for lazy evaluation. It is incredibly useful for
// creating async actions, especially when combined with redux-thunk!
export function getMoviesByTag(tag = 'hot-trong-thang') {
  return (dispatch, getState) => {
    if (getState().home.isFetching) {
      return;
    }
    if (!getState().auth.isAuthenticated) {
      // should dispatch an action that ask user to login
      return;
    }
    const creds = getState().auth.creds;
    const page = getState().home.page + 1;
    dispatch(requestMovies());
    hdviet.getMoviesByTag(tag, { accessToken: creds.access_token, page })
      .then(data => {
        return data.lists.map((item) => {
          return {
            id: item.MovieID,
            name: {
              en: item.MovieName,
              vi: item.KnownAs,
            },
            trailer: item.Trailer,
            releaseDate: item.ReleaseDate,
            plot: {
              vi: item.PlotVI,
              en: item.PlotEN,
            },
            director: item.Director,
            imdbRating: item.ImdbRating,
            poster: `http://t.hdviet.com/thumbs/124x184/${item.NewPoster}`,
            backdrop: `http://t.hdviet.com/backdrops/945x530/${item.Backdrop}`,
          };
        });
      })
      .then(movies => {
        dispatch(receiveMovies(movies));
      });
  };
}

export function getHomeMovies() {
  return getMoviesByTag('hot-trong-thang', ...arguments);
}

export const actions = {
  getHomeMovies,
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [REQUEST_MOVIES]: (state) => ({ ...state, isFetching: true }),
  [RECEIVE_MOVIES]: (state, { payload }) => {
    const movies = [];
    movies.push(...state.movies);
    movies.push(...payload.movies);
    return {
      ...state,
      page: state.page + 1,
      movies,
      isFetching: false,
      error: false,
      errorMessage: '',
    };
  },
  [RECEIVE_ERRORS]: (state, { payload }) => ({
    ...state,
    isFetching: false,
    error: true,
    errorMessage: payload.message,
  }),
}, {
  error: false,
  errorMessage: '',
  isFetching: false,
  page: 0,
  limit: 20,
  movies: [],
});
