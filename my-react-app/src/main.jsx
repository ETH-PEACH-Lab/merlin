import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

const rootElement = document.getElementById('app');
ReactDOM.render(
    <App />,
  rootElement
);

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    ReactDOM.render(
         <NextApp />,
      rootElement
    );
  });
}
