import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService.js';

// Get user from localStorage for persistent login
const user = authService.getCurrentUser();

const initialState = {
  user: user ? user : null,
  isAuthenticated: user ? true : false,
  role: user ? user.role : null,
  status: 'idle',
  error: null,
};

// Async thunks
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      return await authService.register(userData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      return await authService.login(userData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (role, { rejectWithValue }) => {
    try {
      await authService.logout(role);
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetStatus: (state) => {
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        // Registration doesn't auto-login
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Login
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isAuthenticated = true;
        state.role = action.payload.role;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.user = null;
        state.isAuthenticated = false;
        state.role = null;
      })
      
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.role = null;
        state.status = 'idle';
        state.error = null;
      });
  },
});

export const { clearError, resetStatus } = authSlice.actions;
export default authSlice.reducer;