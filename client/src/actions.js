import { push } from 'react-router-redux';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import ObjectID from 'bson-objectid';

import Api from './utils/Api';
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

function requestJournalEntry() {
  return {
    type: 'JOURNAL_ENTRY_REQUEST',
    isFetching: true,
    isWriting: false,
  };
}

function receiveJournalEntry(entry) {
  return {
    type: 'JOURNAL_ENTRY_SUCCESS',
    isFetching: false,
    isWriting: true,
    entry,
  };
}

function journalError(message) {
  return {
    type: 'JOURNAL_ENTRY_FAILURE',
    isFetching: false,
    isWriting: false,
    message,
  };
}

function startJournalEntry(newId, createdAt) {
  return {
    type: 'JOURNAL_ENTRY_START',
    isFetching: false,
    isWriting: true,
    newId,
    createdAt,
  };
}

export function savingJournalEntry() {
  return {
    type: 'JOURNAL_ENTRY_SAVING',
    isSaving: true,
  };
}

function savedJournalEntry(entry) {
  return {
    type: 'JOURNAL_ENTRY_SAVED',
    isSaving: false,
    entry,
  };
}

function stuckSelected(isStuck) {
  return {
    type: 'STUCK_SELECTED',
    isStuck,
  };
}

export function gratefulSelected(gratefulId) {
  return {
    type: 'GRATEFUL_SELECTED',
    gratefulId,
  };
}

function gratefulEntered(gratefulArr) {
  return {
    type: 'GRATEFUL_ENTERED',
    gratefulArr,
  };
}

/* ASYNC actions using thunk below */

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
    dispatch(showLoading());

    setTimeout(() => { dispatch(hideLoading()); }, 150);

    return auth.login({
      connection: 'Username-Password-Authentication',
      responseType: 'token',
      sso: false,
      callbackURL: 'http://localhost:3000/',
      email: creds.email,
      password: creds.password,
    }, (err) => {
      if (err) {
        dispatch(loginError(err.message));
        dispatch(hideLoading());
      }
      dispatch(hideLoading());
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
    dispatch(hideLoading());
    auth.parseHash(hash, (err, user) => {
      if (err) {
        dispatch(userError(err.message));
      } else {
        dispatch(receiveUser(user));
        dispatch(getJournalEntry(user));
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

export function getJournalEntry(user) {
  return (dispatch) => {
    dispatch(requestJournalEntry());
    dispatch(showLoading());
    const ts = new Date();
    ts.setHours(0, 0, 0, 0);
    const query = {
      date: ts.toISOString(),
      userId: user.user_id,
    };
    Api.post('journal-entries', query, (res, err) => {
      if (err || res.status === 'Internal Server Error') {
        let errorMessage;
        if (err) errorMessage = err.message;
        if (res.status === 'Internal Server Error') errorMessage = res.status;
        dispatch(journalError(errorMessage));
        dispatch(hideLoading());
      } else if (res.message && res.message.includes('No journal entry')) {
        const newId = ObjectID.generate();
        const createdAt = new Date();
        dispatch(startJournalEntry(newId, createdAt));
        dispatch(saveJournalEntry(user.user_id, {
          _id: newId, created_at: createdAt,
        }));
        dispatch(hideLoading());
        // dispatch(push(`/entry/${newId}`));
      } else {
        dispatch(receiveJournalEntry(res));
        dispatch(hideLoading());
        // dispatch(push(`/entry/${res._id}`));
      }
    });
  };
}

export function saveJournalEntry(userId, journalEntry) {
  return (dispatch) => {
    dispatch(savingJournalEntry());
    const query = {
      userId,
      journalEntry,
    };
    Api.post('journal-entries', query, (res, err) => {
      if (err) {
        console.log(err);
        dispatch(journalError(err.message));
      } else {
        dispatch(savedJournalEntry(journalEntry));
      }
    });
  };
}

export function stuckSelectedAndSaved(userId, journalEntry, isStuck) {
  return (dispatch) => {
    const entry = { ...journalEntry, isStuck };
    dispatch(stuckSelected(isStuck));
    dispatch(saveJournalEntry(userId, entry));
  };
}

export function gratefulEnteredAndSaved(userId, journalEntry, gratefulArr) {
  return (dispatch) => {
    const entry = { ...journalEntry, grateful: gratefulArr };
    dispatch(gratefulEntered(gratefulArr));
    dispatch(saveJournalEntry(userId, entry));
  };
}
