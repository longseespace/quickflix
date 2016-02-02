import { createAction, handleActions } from 'redux-actions';
require('es6-promise').polyfill();
import fetch from 'isomorphic-fetch';

// ------------------------------------
// Constants
// ------------------------------------
const API_URL = 'http://rest.hdviet.com/api/v3';
const API_TOKEN = '42aef4b7fb334fa1a752b5ff7328c1d5';

export const REQUEST_SUGGESTIONS = 'REQUEST_SUGGESTIONS';
export const RECEIVE_SUGGESTIONS = 'RECEIVE_SUGGESTIONS';
export const INVALIDATE_SUGGESTIONS = 'INVALIDATE_SUGGESTIONS';

export const REQUEST_SEARCH = 'REQUEST_SEARCH';
export const RECEIVE_SEARCH_RESULTS = 'RECEIVE_SEARCH_RESULTS';

export const UPDATE_KEYWORD = 'UPDATE_KEYWORD';

// ------------------------------------
// Actions
// ------------------------------------
export const requestSuggestions = createAction(REQUEST_SUGGESTIONS, (keyword = '') => {
  return { keyword };
});

export const receiveSuggestions = createAction(RECEIVE_SUGGESTIONS, (keyword = '', suggestions = []) => {
  return {
    keyword,
    suggestions,
  };
});

export const invalidateSuggestions = createAction(INVALIDATE_SUGGESTIONS, (keyword = '') => {
  return { keyword };
});

export const requestSearch = createAction(REQUEST_SEARCH, (keyword = '') => {
  return { keyword };
});

export const receiveSearchResults = createAction(RECEIVE_SEARCH_RESULTS, (data = {}) => {
  return data;
});

export const fetchSuggestions = (keyword = '') => {
  return (dispatch) => {
    dispatch(requestSuggestions(keyword));
    const url = `${API_URL}/search?keyword=${keyword}`;
    return fetch(url, {
      headers: {
        Authorization: API_TOKEN,
      },
    }).then(response => response.json())
      .then(json => {
        if (json.error) {
          // error
        } else {
          const results = json.data.response.docs.map((item) => {
            return {
              id: item.id,
              name: item.mo_name,
              releaseDate: item.mo_release_date,
              summary: item.mo_plot_vi,
              directedBy: item.mo_director,
              imdbRating: item.mo_imdb_rating,
              poster: `http://t.hdviet.com/thumbs/124x184/${item.mo_new_poster}`,
            };
          });
          dispatch(receiveSuggestions(keyword, results));
        }
      });
  };
};

export const actions = {
  requestSuggestions,
  invalidateSuggestions,
  requestSearch,
  receiveSuggestions,
  receiveSearchResults,
  fetchSuggestions,
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [REQUEST_SUGGESTIONS]: (state, { payload }) => {
    return { ...payload, isFetching: true };
  },
  [INVALIDATE_SUGGESTIONS]: (state, { payload }) => {
    return { ...payload, suggestions: [], isFetching: false };
  },
  [REQUEST_SEARCH]: (state, { payload }) => {
    return { ...payload, isFetching: true };
  },
  [RECEIVE_SUGGESTIONS]: (state, { payload }) => {
    return { ...payload, isFetching: false };
  },
  [RECEIVE_SEARCH_RESULTS]: (state, { payload }) => {
    return { ...payload, isFetching: false };
  },
}, {
  lastSuggestionRequestId: 0,
  keyword: '',
  isFetching: false,
  suggestions: [],
});
