import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService.js';

// Get user from localStorage (for persistent login)
const user = JSON.parse(localStorage.getItem('user'));

// ---------------------------------------------------------------------
// 1. INITIAL STATE
// ---------------------------------------------------------------------

const initialState = {
  user: user ? user : null, // user will contain token, role, and username
  isAuthenticated: user ? true : false,
  role: user ? user.role : null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// ---------------------------------------------------------------------
// 2. ASYNC THUNKS (API Interactions)
// ---------------------------------------------------------------------

// Thunk for User Registration
export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      // userData includes { username, email, password, role }
      return await authService.register(userData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Thunk for User Login
export const login = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      // userData includes { email, password }
      return await authService.login(userData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ---------------------------------------------------------------------
// 3. AUTH SLICE SETUP
// ---------------------------------------------------------------------

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Reducer for user logout (synchronous)
    logout: (state) => {
      authService.logout(); // Clear localStorage
      state.user = null;
      state.isAuthenticated = false;
      state.role = null;
      state.status = 'idle';
      state.error = null;
    },
    // Reducer to clear status/error messages
    resetAuthStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Register Cases ---
      .addCase(register.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isAuthenticated = true;
        state.role = action.payload.role;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.user = null;
        state.isAuthenticated = false;
        state.role = null;
      })
      
      // --- Login Cases ---
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isAuthenticated = true;
        state.role = action.payload.role;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.user = null;
        state.isAuthenticated = false;
        state.role = null;
      });
  },
});

export const { logout, resetAuthStatus } = authSlice.actions;
export default authSlice.reducer;