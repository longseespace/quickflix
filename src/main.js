import React from 'react';
import ReactDOM from 'react-dom';
import createHistory from 'history/lib/createBrowserHistory';
import { useRouterHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import makeRoutes from './routes';
import Root from './containers/Root';
import configureStore from './redux/configureStore';
import Perf from 'react-addons-perf';
window.Perf = Perf;

require('react-tap-event-plugin')();

// Create redux store and sync with react-router-redux. We have installed the
// react-router-redux reducer under the key "router" in src/routes/index.js,
// so we need to provide a custom `selectLocationState` to inform
// react-router-redux of its location.
const initialState = window.__INITIAL_STATE__;
const store = configureStore(initialState);

// Configure history for react-router
const browserHistory = useRouterHistory(createHistory)({
  basename: __BASENAME__
});
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: (state) => state.router
});

// Now that we have the Redux store, we can create our routes. We provide
// the store to the route definitions so that routes have access to it for
// hooks such as `onEnter`.
const routes = makeRoutes(store);

// add GA tracking
import ga from 'react-ga';
ga.initialize('UA-24034280-5');

function logPageView () {
  ga.pageview(this.state.location.pathname);
}

// Now that redux and react-router have been configured, we can render the
// React application to the DOM!
ReactDOM.render(
  <Root history={history} routes={routes} store={store} onUpdate={logPageView} />,
  document.getElementById('root')
);
