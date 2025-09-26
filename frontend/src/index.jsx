// src/index.jsx (or main.jsx)
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.jsx';
import { store } from './app/store.js'; // Ensure this path is correct

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* THIS IS WHERE THE REDUX CONTEXT IS PROVIDED */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);