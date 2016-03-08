import React from 'react'
import { Route, IndexRoute, Redirect } from 'react-router'

// NOTE: here we're making use of the `resolve.root` configuration
// option in webpack, which allows us to specify import paths as if
// they were from the root of the ~/src directory. This makes it
// very easy to navigate to files regardless of how deeply nested
// your current file is.
import CoreLayout from 'layouts/CoreLayout/CoreLayout'
import HomeView from 'views/HomeView/HomeView'
import SearchView from 'views/SearchView/SearchView'
import NotFoundView from 'views/NotFoundView/NotFoundView'
import AuthView from 'views/AuthView/AuthView'
import InitView from 'views/InitView/InitView'
import MovieDetailView from 'views/MovieDetailView/MovieDetailView'
import TagView from 'views/TagView/TagView'
import FilterView from 'views/FilterView/FilterView'
import FavoriteView from 'views/FavoriteView/FavoriteView'

export default (store) => (
  <Route path='/' component={CoreLayout}>
    <IndexRoute component={HomeView} />
    <Route path='/init' component={InitView} />
    <Route path='/auth' component={AuthView} />
    <Route path='/search/' component={SearchView}>
      <Route path=':keyword' component={SearchView} />
    </Route>
    <Route path='/category/:tag' component={TagView} />
    <Route path='/movies/:tag(/:genre)' component={FilterView} />
    <Route path='/movie/:id' component={MovieDetailView} />
    <Route path='/movie/:id/:episode' component={MovieDetailView} />
    <Route path='/yeu-thich' component={FavoriteView} />
    <Route path='/404' component={NotFoundView} />
    <Redirect from='*' to='/404' />
  </Route>
)
