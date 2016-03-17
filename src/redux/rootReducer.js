import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'

import topnav from './modules/nav'
import home from './modules/home'
import search from './modules/search'
import auth from './modules/auth'
import movie from './modules/movie'
import filter from './modules/filter'
import favorite from './modules/favorite'

export default combineReducers({
  router,
  topnav,
  home,
  search,
  auth,
  movie,
  filter,
  favorite
})
