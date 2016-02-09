import { createAction, handleActions } from 'redux-actions';
import hdviet from '../utils/hdviet';
import debounce from 'lodash.debounce';

// ------------------------------------
// Constants
// ------------------------------------
const API_REQUEST_DEBOUNCE_WAIT = 500;

export const REQUEST_SUGGESTIONS = 'REQUEST_SUGGESTIONS';
export const RECEIVE_SUGGESTIONS = 'RECEIVE_SUGGESTIONS';
export const INVALIDATE_SUGGESTIONS = 'INVALIDATE_SUGGESTIONS';
export const RECEIVE_ERRORS = 'RECEIVE_ERRORS';

// ------------------------------------
// Actions
// ------------------------------------
export const requestSuggestions = createAction(REQUEST_SUGGESTIONS, keyword => keyword);

export const receiveSuggestions = createAction(RECEIVE_SUGGESTIONS, (keyword, suggestions) => ({ suggestions }));

export const invalidateSuggestions = createAction(INVALIDATE_SUGGESTIONS, (keyword) => ({
  keyword,
  suggestions: [],
}));

export const receiveErrors = createAction(RECEIVE_ERRORS, (message) => ({ message }));

const doFetch = (dispatch, keyword) => {
  dispatch(requestSuggestions(keyword));
  hdviet.search(keyword, { limit: 5 })
    .then(data => {
      return data.docs.map((item) => {
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
    })
    .then(movies => {
      dispatch(receiveSuggestions(keyword, movies));
    })
    .catch(error => {
      dispatch(receiveErrors(error.message));
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
  receiveSuggestions,
  fetchSuggestions,
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
  [RECEIVE_SUGGESTIONS]: (state, { payload }) => {
    return { ...state, ...payload, isFetching: false, invalidated: false };
  },
}, {
  requestId: 0,
  keyword: '',
  invalidated: true,
  isFetching: false,
  suggestions: [],
});
