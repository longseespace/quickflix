import { combineReducers } from 'redux';
import { routeReducer as router } from 'redux-simple-router';

import topnav from './modules/topnav';
import home from './modules/home';
import search from './modules/search';
import auth from './modules/auth';

export default combineReducers({
  router,
  topnav,
  home,
  search,
  auth,
});
