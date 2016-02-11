import { createAction, handleActions } from 'redux-actions';
import hdviet from '../utils/hdviet';
import debounce from 'lodash.debounce';

// ------------------------------------
// Constants
// ------------------------------------
const API_REQUEST_DEBOUNCE_WAIT = 500;

export const REQUEST_SUGGESTIONS = 'TOPNAV:REQUEST_SUGGESTIONS';
export const RECEIVE_SUGGESTIONS = 'TOPNAV:RECEIVE_SUGGESTIONS';
export const CLEAR_SUGGESTIONS = 'TOPNAV:CLEAR_SUGGESTIONS';
export const SHOW_SUGGESTIONS = 'TOPNAV:SHOW_SUGGESTIONS';
export const HIDE_SUGGESTIONS = 'TOPNAV:HIDE_SUGGESTIONS';
export const RECEIVE_ERRORS = 'TOPNAV:RECEIVE_ERRORS';
export const UPDATE_KEYWORD = 'TOPNAV:UPDATE_KEYWORD';

// ------------------------------------
// Actions
// ------------------------------------
export const requestSuggestions = createAction(REQUEST_SUGGESTIONS);

export const updateKeyword = createAction(UPDATE_KEYWORD, keyword => ({ keyword }));

export const receiveSuggestions = createAction(RECEIVE_SUGGESTIONS, suggestions => ({ suggestions }));

export const clearSuggestions = createAction(CLEAR_SUGGESTIONS);

export const showSuggestions = createAction(SHOW_SUGGESTIONS);

export const hideSuggestions = createAction(HIDE_SUGGESTIONS);

export const receiveErrors = createAction(RECEIVE_ERRORS, message => ({ message }));

const doFetch = (dispatch, getState, keyword) => {
  if (!getState().auth.isAuthenticated) {
    // should dispatch an action that ask user to login
    return;
  }
  const creds = getState().auth.creds;
  dispatch(requestSuggestions());
  hdviet.search(keyword, { accessToken: creds.access_token, limit: 5 })
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
      const currentKeyword = getState().topnav.keyword;
      if (keyword === currentKeyword) {
        dispatch(receiveSuggestions(movies));
      } else {
        dispatch(clearSuggestions());
      }
    })
    .catch(error => {
      dispatch(receiveErrors(error.message));
    });
};

const debouncedFetch = debounce(doFetch, API_REQUEST_DEBOUNCE_WAIT);

export function fetchSuggestions(keyword = '') {
  return (dispatch, getState) => {
    debouncedFetch(dispatch, getState, keyword);
  };
}

export const actions = {
  requestSuggestions,
  clearSuggestions,
  receiveSuggestions,
  fetchSuggestions,
  showSuggestions,
  hideSuggestions,
  updateKeyword,
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [UPDATE_KEYWORD]: (state, { payload }) => ({
    ...state,
    ...payload,
  }),
  [REQUEST_SUGGESTIONS]: (state) => ({
    ...state,
    requestId: state.requestId + 1,
    isFetching: true,
  }),
  [CLEAR_SUGGESTIONS]: (state, { payload }) => ({
    ...state,
    ...payload,
    suggestions: [],
    isFetching: false,
  }),
  [RECEIVE_SUGGESTIONS]: (state, { payload }) => ({
    ...state,
    ...payload,
    isFetching: false,
  }),
  [SHOW_SUGGESTIONS]: (state) => ({
    ...state,
    isSuggestionsActive: true,
  }),
  [HIDE_SUGGESTIONS]: (state) => ({
    ...state,
    isSuggestionsActive: false,
  }),
}, {
  requestId: 0,
  keyword: '',
  isFetching: false,
  isSuggestionsActive: false,
  suggestions: [],
});
