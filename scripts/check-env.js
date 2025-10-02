#!/usr/bin/env node

require('dotenv').config();

console.log('Environment Variables Check:');
console.log('==========================');
console.log(`REACT_APP_POSTHOG_KEY: ${process.env.REACT_APP_POSTHOG_KEY ? 'SET' : 'NOT SET'}`);
console.log(`REACT_APP_POSTHOG_HOST: ${process.env.REACT_APP_POSTHOG_HOST || 'default: https://app.posthog.com'}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);

if (process.env.REACT_APP_POSTHOG_KEY) {
  console.log(`\nPostHog API Key length: ${process.env.REACT_APP_POSTHOG_KEY.length}`);
  console.log(`PostHog API Key starts with: ${process.env.REACT_APP_POSTHOG_KEY.substring(0, 10)}...`);
} else {
  console.log('\n⚠️  REACT_APP_POSTHOG_KEY is not set!');
  console.log('   This will cause PostHog to be disabled.');
}

console.log('\nTo fix PostHog issues:');
console.log('1. Make sure you have a .env file in your project root');
console.log('2. Add: REACT_APP_POSTHOG_KEY=your_actual_posthog_api_key');
console.log('3. Restart your development server');
