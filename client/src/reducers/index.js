import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { loadingBarReducer } from 'react-redux-loading-bar';

// import reducers here
import auth from './auth';
import journal from './journal';

const rootReducer = combineReducers({
  auth,
  journal,
  loadingBar: loadingBarReducer,
  routing: routerReducer,
});

export default rootReducer;
