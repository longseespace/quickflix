import { combineReducers } from 'redux';
import { routeReducer as router } from 'redux-simple-router';

import search from './modules/search';
import movie from './modules/movie';

export default combineReducers({
  search,
  movie,
  router,
});
