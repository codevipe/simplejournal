import { createStore, compose, applyMiddleware } from 'redux';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router';
import thunk from 'redux-thunk';

import rootReducer from './reducers/index';

import AuthService from './utils/AuthService';
import config from './utils/config';

const auth = new AuthService(config.AUTH0_CLIENT_ID, config.AUTH0_DOMAIN);

const defaultState = {
  auth: {
    isFetching: false,
    isAuthenticated: auth.loggedIn(),
    user: localStorage.getItem('user_profile') ? JSON.parse(localStorage.getItem('user_profile')) : null,
  },
  journal: {
    isFetching: false,
    isWriting: false,
    enteringGrateful: false,
    entry: {},
  },
};

const enhancers = compose(
  applyMiddleware(routerMiddleware(browserHistory), thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f,
);

const store = createStore(rootReducer, defaultState, enhancers);

export const history = syncHistoryWithStore(browserHistory, store);

export default store;
