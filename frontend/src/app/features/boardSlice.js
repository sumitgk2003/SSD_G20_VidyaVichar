import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import questionService from '../../services/questionService.js';

const initialState = {
  questions: [],
  currentClass: null,
  filter: 'all', // 'all', 'unanswered', 'answered', 'important'
  status: 'idle',
  error: null,
};

// Async thunks
export const fetchQuestions = createAsyncThunk(
  'board/fetchQuestions',
  async (classId, { rejectWithValue }) => {
    try {
      return await questionService.getQuestions(classId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createQuestion = createAsyncThunk(
  'board/createQuestion',
  async (questionData, { rejectWithValue }) => {
    try {
      return await questionService.createQuestion(questionData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateQuestion = createAsyncThunk(
  'board/updateQuestion',
  async (updateData, { rejectWithValue }) => {
    try {
      return await questionService.updateQuestion(updateData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetStatus: (state) => {
      state.status = 'idle';
    },
    clearQuestions: (state) => {
      state.questions = [];
    },
    markAsAnswered: (state, action) => {
      const question = state.questions.find(q => q.id === action.payload);
      if (question) {
        question.status = 'answered';
      }
    },
    markAsImportant: (state, action) => {
      const question = state.questions.find(q => q.id === action.payload);
      if (question) {
        question.isImportant = !question.isImportant;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Questions
      .addCase(fetchQuestions.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.questions = action.payload.questions;
        state.currentClass = action.payload.classDetails;
        state.error = null;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Create Question
      .addCase(createQuestion.fulfilled, (state, action) => {
        state.questions.unshift(action.payload);
      })
      
      // Update Question
      .addCase(updateQuestion.fulfilled, (state, action) => {
        const index = state.questions.findIndex(q => q.id === action.payload.id);
        if (index !== -1) {
          state.questions[index] = action.payload;
        }
      });
  },
});

export const { 
  setFilter, 
  clearError, 
  resetStatus, 
  clearQuestions,
  markAsAnswered,
  markAsImportant 
} = boardSlice.actions;

export default boardSlice.reducer;