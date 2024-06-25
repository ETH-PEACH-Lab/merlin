import 'react-hot-loader/patch';
import {AppContainer} from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import ons from 'onsenui';

// Onsen UI Styling and Icons
require('onsenui/css/onsen-css-components.css');
require('onsenui/css/onsenui.css');

import App from './App';

if (ons.platform.isIPhoneX()) {
  document.documentElement.setAttribute('onsflag-iphonex-portrait', '');
  document.documentElement.setAttribute('onsflag-iphonex-landscape', '');
}

const rootElement = document.getElementById('app');
ReactDOM.render(
  <AppContainer>
    <App />
  </AppContainer>,
  rootElement
);

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    ReactDOM.render(
      <AppContainer>
         <NextApp />
      </AppContainer>,
      rootElement
    );
  });
}
