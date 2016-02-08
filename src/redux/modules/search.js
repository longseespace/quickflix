import { createAction, handleActions } from 'redux-actions';
require('es6-promise').polyfill();
import fetch from 'isomorphic-fetch';
import debounce from 'lodash.debounce';

// ------------------------------------
// Constants
// ------------------------------------
const API_URL = 'http://rest.hdviet.com/api/v3';
const API_TOKEN = 'fb4b338e218b4c2cbbc2722debd3acd1';
const API_REQUEST_DEBOUNCE_WAIT = 500;

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
  suggestions,
}));

export const invalidateSuggestions = createAction(INVALIDATE_SUGGESTIONS, (keyword) => ({
  keyword,
  suggestions: [],
}));

export const requestSearch = createAction(REQUEST_SEARCH, keyword => keyword);

export const receiveSearchResults = createAction(RECEIVE_SEARCH_RESULTS, (keyword, searchResults) => ({
  keyword,
  searchResults,
}));

const doFetch = (dispatch, keyword, options = { limit: 5, page: 1, type: 'suggest' }) => {
  const { limit, page, type } = options;
  const url = `${API_URL}/search?keyword=${keyword}&limit=${limit}&page=${page}`;
  if (type === 'search') {
    dispatch(requestSearch(keyword));
  } else {
    dispatch(requestSuggestions(keyword));
  }
  const fetchOptions = {
    headers: {
      Authorization: API_TOKEN,
    },
  };
  return fetch(url, fetchOptions).then(response => response.json())
    .then(json => {
      if (json.error) {
        // error
      } else {
        const results = json.data.response.docs.map((item) => {
          return {
            id: item.id,
            name: {
              en: item.mo_name,
              vi: item.mo_known_as,
            },
            releaseDate: item.mo_release_date,
            plot: {
              vi: item.mo_plot_vi,
              en: item.mo_plot_en,
            },
            director: item.mo_director,
            imdbRating: item.mo_imdb_rating,
            poster: `http://t.hdviet.com/thumbs/124x184/${item.mo_new_poster}`,
            backdrop: `http://t.hdviet.com/backdrops/945x530/${item.mo_backdrop}`,
          };
        });
        if (type === 'search') {
          dispatch(receiveSearchResults(keyword, results));
        } else {
          dispatch(receiveSuggestions(keyword, results));
        }
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

export const fetchSearchResults = (keyword = '', options = { limit: 20, page: 1 }) => {
  return (dispatch) => {
    dispatch(invalidateSuggestions(keyword));
    debouncedFetch(dispatch, keyword, { ...options, type: 'search' });
  };
};

export const actions = {
  requestSuggestions,
  invalidateSuggestions,
  requestSearch,
  receiveSuggestions,
  receiveSearchResults,
  fetchSuggestions,
  fetchSearchResults,
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [REQUEST_SUGGESTIONS]: (state, { payload }) => {
    return { ...state, requestId: state.requestId + 1, keyword: payload, isFetching: true, invalidated: false };
  },
  [INVALIDATE_SUGGESTIONS]: (state, { payload }) => {
    return { ...state, ...payload, isFetching: false, invalidated: true };
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
  requestId: 0,
  keyword: '',
  invalidated: true,
  isFetching: false,
  suggestions: [],
});
