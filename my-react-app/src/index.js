// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

const ignoreResizeObserverError = (event) => {
  if (event.message === 'ResizeObserver loop completed with undelivered notifications.') {
    event.stopImmediatePropagation();
  }
};

window.addEventListener('error', ignoreResizeObserverError);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('app')
);
