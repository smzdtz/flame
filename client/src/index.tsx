import React from 'react';
import ReactDOM from 'react-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import './index.css';

import { Provider } from 'react-redux';
import { store } from './store/store';

// i18n
import zh from './i18n/zh.json';
import en from './i18n/en.json';

import { App } from './App';

i18n.use(initReactI18next).init({
  resources: {
    en,
    zh,
  },
  lng: 'zh',
  fallbackLng: 'zh',

  interpolation: {
    escapeValue: false,
  },
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
