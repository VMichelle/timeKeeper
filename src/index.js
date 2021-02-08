import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import reducer from './reducers/reducer';
import thunk from 'redux-thunk';

let middleware = [thunk];
let composeEnhancers = compose;
composeEnhancers = require('redux-devtools-extension').composeWithDevTools;

const enhancers = composeEnhancers(
  applyMiddleware(...middleware)
);

const store = createStore(
  reducer, /* preloadedState, */
  enhancers
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
