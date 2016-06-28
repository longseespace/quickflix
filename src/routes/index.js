import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

// NOTE: here we're making use of the `resolve.root` configuration
// option in webpack, which allows us to specify import paths as if
// they were from the root of the ~/src directory. This makes it
// very easy to navigate to files regardless of how deeply nested
// your current file is.
import CoreLayout from 'layouts/CoreLayout/CoreLayout';
import HomeView from 'views/HomeView/HomeView';
import SearchView from 'views/SearchView/SearchView';
import NotFoundView from 'views/NotFoundView/NotFoundView';
import AuthView from 'views/AuthView/AuthView';
import InitView from 'views/InitView/InitView';
import MovieDetailView from 'views/MovieDetailView/MovieDetailView';
import Nav from 'views/Nav/Nav';
import FilterView from 'views/FilterView/FilterView';
import FavoriteView from 'views/FavoriteView/FavoriteView';

export default (store) => (
  <Route path='/' component={CoreLayout}>
    <IndexRoute components={{nav: Nav, main: HomeView}} />
    <Route path='/init' component={InitView} />
    <Route path='/auth' component={AuthView} />
    <Route path='/search/:keyword' components={{nav: Nav, main: SearchView}} />
    <Route path='/movies/:tag(/:genre)' components={{nav: Nav, main: FilterView}} />
    <Route path='/movie/:id' components={{nav: Nav, main: MovieDetailView}} />
    <Route path='/movie/:id/:episode' components={{nav: Nav, main: MovieDetailView}} />
    <Route path='/yeu-thich' components={{nav: Nav, main: FavoriteView}} />
    <Route path='/404' component={NotFoundView} />
    <Redirect from='*' to='/404' />
  </Route>
);
