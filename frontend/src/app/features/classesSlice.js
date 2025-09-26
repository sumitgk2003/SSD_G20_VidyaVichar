import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Assume you have a service file to handle API calls
import classService from '../../services/classService.js'; 

// ---------------------------------------------------------------------
// 1. ASYNC THUNKS (API Interactions)
// ---------------------------------------------------------------------

// Thunk for fetching the list of classes for the authenticated user
export const fetchClasses = createAsyncThunk(
  'classes/fetchClasses',
  async (_, thunkAPI) => {
    try {
      // Get the token from the auth state to authorize the API call
      const token = thunkAPI.getState().auth.user.token;
      
      // The API should return classes relevant to the user's role (instructor's classes OR student's classes)
      return await classService.getClasses(token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Thunk for instructors to create a new class
export const createClass = createAsyncThunk(
  'classes/createClass',
  async (classData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await classService.createClass(classData, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Thunk for students to join a class using an access code
export const joinClass = createAsyncThunk(
  'classes/joinClass',
  async (accessCode, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await classService.joinClass(accessCode, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);


// ---------------------------------------------------------------------
// 2. SLICE SETUP
// ---------------------------------------------------------------------

const initialState = {
  classes: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

export const classesSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {
    resetClassesStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- fetchClasses ---
      .addCase(fetchClasses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.classes = action.payload; // API returns the full list of classes
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.classes = [];
      })
      
      // --- createClass ---
      .addCase(createClass.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Add the newly created class to the list
        state.classes.push(action.payload);
      })
      .addCase(createClass.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // --- joinClass ---
      .addCase(joinClass.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Add the newly joined class to the list
        state.classes.push(action.payload);
      })
      .addCase(joinClass.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { resetClassesStatus } = classesSlice.actions;
export default classesSlice.reducer;