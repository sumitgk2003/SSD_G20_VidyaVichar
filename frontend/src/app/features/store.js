import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import classReducer from './classSlice.js';
import boardReducer from './boardSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    classes: classReducer,
    board: boardReducer,
  },
  devTools: import.meta.env.NODE_ENV !== 'production',
});