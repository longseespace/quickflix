import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'

import topnav from './modules/topnav'
import home from './modules/home'
import search from './modules/search'
import auth from './modules/auth'
import movie from './modules/movie'
import { tagReducerCreator } from './modules/tag'

const tags = 'xu-huong|hanh-dong|co-trang|hinh-su-toi-pham|hai|tinh-cam|kinh-di|khoa-hoc-vien-tuong|vo-thuat|chien-tranh|than-thoai|hoat-hinh|anime|am-nhac|the-thao|tam-ly|bat-ky|au-my|trung-quoc|hong-kong|han-quoc|an-do|viet-nam|thai-lan|nuoc-khac'.split('|')
const tagReducers = tags.map((tag) => {
  const reducer = {}
  reducer[`tag:${tag}`] = tagReducerCreator(tag)
  return reducer
}).reduce((prev, curr) => ({
  ...prev,
  ...curr
}), {})

export default combineReducers({
  router,
  topnav,
  home,
  search,
  auth,
  movie,
  ...tagReducers
})
