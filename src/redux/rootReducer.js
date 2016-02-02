import { combineReducers } from 'redux';
import { routeReducer as router } from 'redux-simple-router';

import search from './modules/search';

export default combineReducers({
  search,
  router,
});
