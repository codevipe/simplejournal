import { push } from 'react-router-redux';

import ApiCall from './utils/ApiCall';
import AuthService from './utils/AuthService';
import config from './utils/config';

const auth = new AuthService(config.AUTH0_CLIENT_ID, config.AUTH0_DOMAIN);

function requestSignup() {
  return {
    type: 'SIGNUP_REQUEST',
    isFetching: true,
    isAuthenticated: false,
  };
}

function receiveSignup() {
  return {
    type: 'SIGNUP_SUCCESS',
    isFetching: false,
    isAuthenticated: false,
  };
}

function signupError(message) {
  return {
    type: 'SIGNUP_FAILURE',
    isFetching: false,
    isAuthenticated: false,
    message,
  };
}

function requestLogin() {
  return {
    type: 'LOGIN_REQUEST',
    isFetching: true,
    isAuthenticated: false,
  };
}

function receiveLogin() {
  return {
    type: 'LOGIN_SUCCESS',
    isFetching: false,
    isAuthenticated: true,
  };
}

function loginError(message) {
  return {
    type: 'LOGIN_FAILURE',
    isFetching: false,
    isAuthenticated: false,
    message,
  };
}

function requestLogout() {
  return {
    type: 'LOGOUT_REQUEST',
    isFetching: true,
    isAuthenticated: true,
  };
}

function receiveLogout() {
  return {
    type: 'LOGOUT_SUCCESS',
    isFetching: false,
    isAuthenticated: false,
  };
}

function requestUser() {
  return {
    type: 'USER_REQUEST',
    isFetching: true,
  };
}

function receiveUser(user) {
  return {
    type: 'USER_SUCCESS',
    isFetching: false,
    user,
  };
}

function userError(message) {
  return {
    type: 'USER_FAILURE',
    isFetching: false,
    message,
  };
}

export function signUpUser(user) {
  return (dispatch) => {
    dispatch(requestSignup());

    return auth.signup({
      connection: 'Username-Password-Authentication',
      responseType: 'token',
      sso: false,
      callbackURL: 'http://localhost:3000/',
      email: user.email,
      password: user.password,
    }, (err) => {
      if (err) {
        dispatch(signupError(err.message));
      } else {
        dispatch(receiveSignup());
      }
    });
  };
}

export function logInUser(creds) {
  return (dispatch) => {
    dispatch(requestLogin());

    return auth.login({
      connection: 'Username-Password-Authentication',
      responseType: 'token',
      sso: false,
      callbackURL: 'http://localhost:3000/',
      email: creds.email,
      password: creds.password,
    }, (err) => {
      if (err) dispatch(loginError(err.message));
    });
  };
}

export function logInUserGoogle() {
  return dispatch => auth.login({
    connection: 'google-oauth2',
  }, (err) => {
    if (err) dispatch(loginError(err.message));
  });
}

export function handleLoginHash(hash) {
  return (dispatch) => {
    auth.parseHash(hash, (err, user) => {
      if (err) {
        dispatch(userError(err.message));
      } else {
        dispatch(receiveUser(user));
      }
    });
    dispatch(requestUser());
    dispatch(receiveLogin());
    dispatch(push('/'));
  };
}

export function logOutUser() {
  return (dispatch) => {
    dispatch(requestLogout());
    auth.logout();
    setTimeout(() => {
      dispatch(receiveLogout());
      dispatch(push('/login'));
    }, 500);
  };
}
