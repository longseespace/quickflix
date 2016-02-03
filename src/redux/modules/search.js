import { createAction, handleActions } from 'redux-actions';
require('es6-promise').polyfill();
import fetch from 'isomorphic-fetch';
import debounce from 'lodash.debounce';

// ------------------------------------
// Constants
// ------------------------------------
const API_URL = 'http://rest.hdviet.com/api/v3';
const API_TOKEN = '42aef4b7fb334fa1a752b5ff7328c1d5';
const API_REQUEST_DEBOUNCE_WAIT = 250;

export const REQUEST_SUGGESTIONS = 'REQUEST_SUGGESTIONS';
export const RECEIVE_SUGGESTIONS = 'RECEIVE_SUGGESTIONS';
export const INVALIDATE_SUGGESTIONS = 'INVALIDATE_SUGGESTIONS';

export const REQUEST_SEARCH = 'REQUEST_SEARCH';
export const RECEIVE_SEARCH_RESULTS = 'RECEIVE_SEARCH_RESULTS';

export const UPDATE_KEYWORD = 'UPDATE_KEYWORD';

// ------------------------------------
// Actions
// ------------------------------------
export const requestSuggestions = createAction(REQUEST_SUGGESTIONS, keyword => keyword);

export const receiveSuggestions = createAction(RECEIVE_SUGGESTIONS, (keyword, suggestions) => ({
  keyword,
  suggestions,
}));

export const invalidateSuggestions = createAction(INVALIDATE_SUGGESTIONS, keyword => keyword);

export const requestSearch = createAction(REQUEST_SEARCH, keyword => keyword);

export const receiveSearchResults = createAction(RECEIVE_SEARCH_RESULTS, keyword => keyword);

const doFetch = (dispatch, keyword) => {
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

const debouncedFetch = debounce(doFetch, API_REQUEST_DEBOUNCE_WAIT);

export const fetchSuggestions = (keyword = '') => {
  return (dispatch) => {
    dispatch(invalidateSuggestions(keyword));
    debouncedFetch(dispatch, keyword);
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
    return { ...state, keyword: payload, isFetching: true, invalidated: false };
  },
  [INVALIDATE_SUGGESTIONS]: (state, { payload }) => {
    return { ...state, keyword: payload, isFetching: false, invalidated: true };
  },
  [REQUEST_SEARCH]: (state, { payload }) => {
    return { ...state, keyword: payload, isFetching: true, invalidated: true };
  },
  [RECEIVE_SUGGESTIONS]: (state, { payload }) => {
    return { ...state, ...payload, isFetching: false, invalidated: false };
  },
  [RECEIVE_SEARCH_RESULTS]: (state, { payload }) => {
    return { ...state, ...payload, isFetching: false, invalidated: true };
  },
}, {
  keyword: '',
  invalidated: true,
  isFetching: false,
  suggestions: [],
});
