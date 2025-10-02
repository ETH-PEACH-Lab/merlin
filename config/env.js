// Environment configuration for webpack
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Ensure environment variables are loaded
const env = {
  REACT_APP_POSTHOG_KEY: process.env.REACT_APP_POSTHOG_KEY,
  REACT_APP_POSTHOG_HOST: process.env.REACT_APP_POSTHOG_HOST || 'https://app.posthog.com',
  NODE_ENV: process.env.NODE_ENV || 'development'
};

// Debug output
console.log('Environment Config Loaded:');
console.log('REACT_APP_POSTHOG_KEY:', env.REACT_APP_POSTHOG_KEY ? 'SET' : 'NOT SET');
console.log('REACT_APP_POSTHOG_HOST:', env.REACT_APP_POSTHOG_HOST);
console.log('NODE_ENV:', env.NODE_ENV);

module.exports = env;
