import React from 'react';
import { render } from 'react-dom';
import { Router, Route } from 'react-router';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';

import * as actionCreators from './actionCreators';
import store, { history } from './store';

// import '../node_modules/semantic-ui-css/semantic.css';
import './css/normalize.css';
import './css/styles.css';

import LogIn from './components/LogIn';
import SignUp from './components/SignUp';
import App from './components/App';
import Home from './components/Home';
import NotFound from './components/NotFound';

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}

const Root = connect(mapStateToProps, mapDispatchToProps)(App);

render(
  <Provider store={store}>
    <Router history={history}>
      <Route component={Root}>
        <Route path="login" component={LogIn} />
        <Route path="signup" component={SignUp} />
        <Route path="/" component={Home} />
      </Route>
      <Route path="*" component={NotFound} />
    </Router>
  </Provider>,
  document.querySelector('#root'),
);
