import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import classService from '../../services/classService.js';

const initialState = {
  classes: [],
  currentClass: null,
  status: 'idle',
  error: null,
};

// Async thunks
export const createClass = createAsyncThunk(
  'classes/createClass',
  async (classData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const instructorId = auth.user?.id;
      const instructorName = auth.user?.name;
      
      return await classService.createClass(
        { ...classData, instructorName }, 
        instructorId
      );
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const joinClass = createAsyncThunk(
  'classes/joinClass',
  async (accessCode, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const studentId = auth.user?.id;
      
      return await classService.joinClass(accessCode, studentId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchInstructorClasses = createAsyncThunk(
  'classes/fetchInstructorClasses',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const instructorId = auth.user?.id;
      
      return await classService.getInstructorClasses(instructorId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchStudentClasses = createAsyncThunk(
  'classes/fetchStudentClasses',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const studentId = auth.user?.id;
      
      return await classService.getStudentClasses(studentId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchClassById = createAsyncThunk(
  'classes/fetchClassById',
  async (classId, { rejectWithValue }) => {
    try {
      return await classService.getClassById(classId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const classSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetStatus: (state) => {
      state.status = 'idle';
    },
    setCurrentClass: (state, action) => {
      state.currentClass = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Class
      .addCase(createClass.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createClass.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.classes.unshift(action.payload);
        state.error = null;
      })
      .addCase(createClass.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Join Class
      .addCase(joinClass.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(joinClass.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.classes.push(action.payload);
        state.error = null;
      })
      .addCase(joinClass.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Fetch Instructor Classes
      .addCase(fetchInstructorClasses.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchInstructorClasses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.classes = action.payload;
        state.error = null;
      })
      .addCase(fetchInstructorClasses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Fetch Student Classes
      .addCase(fetchStudentClasses.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchStudentClasses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.classes = action.payload;
        state.error = null;
      })
      .addCase(fetchStudentClasses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Fetch Class by ID
      .addCase(fetchClassById.fulfilled, (state, action) => {
        state.currentClass = action.payload;
      });
  },
});

export const { clearError, resetStatus, setCurrentClass } = classSlice.actions;
export default classSlice.reducer;
