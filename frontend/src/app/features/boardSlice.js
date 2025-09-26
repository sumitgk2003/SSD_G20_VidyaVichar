import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Assume you have a service file to handle API calls
import questionService from '../../services/questionService.js'; 

// ---------------------------------------------------------------------
// 1. ASYNC THUNKS (API Interactions)
// ---------------------------------------------------------------------

// Thunk to fetch all questions for a specific class ID
export const fetchQuestions = createAsyncThunk(
  'board/fetchQuestions',
  async (classId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await questionService.getQuestions(classId, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Thunk for students to post a new question
export const postQuestion = createAsyncThunk(
  'board/postQuestion',
  async (questionData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      // questionData includes { classId, text }
      return await questionService.createQuestion(questionData, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Thunk for instructors to update a question's status (e.g., answered, important)
export const updateQuestionStatus = createAsyncThunk(
  'board/updateQuestionStatus',
  async (updateData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      // updateData includes { classId, questionId, newStatus, isImportant }
      return await questionService.updateQuestion(updateData, token);
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
  questions: [],
  currentClass: null, // Stores data for the class currently being viewed
  filter: 'unanswered', // 'all', 'unanswered', 'answered', 'important'
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    // Reducer to change the filter state (used by FilterControls.jsx)
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    resetBoardStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
    // Reducer to clear all questions (for "Clear Board" action, if implemented)
    clearQuestions: (state) => {
        state.questions = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // --- fetchQuestions ---
      .addCase(fetchQuestions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Payload should contain { questions: [...], classDetails: {...} }
        state.questions = action.payload.questions;
        state.currentClass = action.payload.classDetails;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.questions = [];
        state.currentClass = null;
      })
      
      // --- postQuestion ---
      .addCase(postQuestion.fulfilled, (state, action) => {
        // Add the new question to the beginning of the array
        state.questions.unshift(action.payload);
      })
      
      // --- updateQuestionStatus ---
      .addCase(updateQuestionStatus.fulfilled, (state, action) => {
        // Find the question and replace it with the updated version
        const index = state.questions.findIndex(q => q.id === action.payload.id);
        if (index !== -1) {
          state.questions[index] = action.payload;
        }
      });
  },
});

export const { setFilter, resetBoardStatus, clearQuestions } = boardSlice.actions;
export default boardSlice.reducer;