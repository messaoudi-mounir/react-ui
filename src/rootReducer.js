import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import login from './login';
import assets from './assets';
import pages from './pages';
import subscriptions from './subscriptions';

export default combineReducers({
  routing: routerReducer,
  [login.constants.NAME]: login.reducer,
  [assets.constants.NAME]: assets.reducer,
  [pages.constants.NAME]: pages.reducer,
  [subscriptions.constants.NAME]: subscriptions.reducer
});
