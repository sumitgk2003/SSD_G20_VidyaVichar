import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import classesReducer from './classesSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    classes: classesReducer,
    // board: boardReducer,
  },
  // Optionally disable devtools in production
  devTools: import.meta.env.NODE_ENV !== 'production',
});