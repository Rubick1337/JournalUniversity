// lessonSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import LessonService from "../../services/LessonService";

export const createLesson = createAsyncThunk(
  "lesson/createLesson",
  async (data, { rejectWithValue }) => {
    try {
      const response = await LessonService.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getPairsOnDate = createAsyncThunk(
  "lesson/getPairsOnDate",
  async (date, { rejectWithValue }) => {
    try {
      const response = await LessonService.getPairsOnDate(date);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getLessonDataById = createAsyncThunk(
  "lesson/getLessonDataById",
  async (lessonId, { rejectWithValue }) => {
    try {
      const response = await LessonService.getLessonDataById(lessonId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const getLessonsForStudent = createAsyncThunk(
  "lesson/getLessonsForStudent",
  async ({studentId, date}, { rejectWithValue }) => {
    try {
      const response = await LessonService.getLessonsForStudent({studentId, date});
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const lessonSlice = createSlice({
  name: "lesson",
  initialState: {
    pairs: {
      isLoading: false,
      errors: null,
      data: [],
    },
    lessonsForStudent: {
      isLoading: false,
      errors: null,
      data: [],
    },

    createLesson: {
      isLoading: false,
      errors: null,
      data: null,
    },
    studentlesson: {
      isLoading: false,
      errors: null,
      data: [],
    },
    currentLesson: {
      data: null,
      isLoading: false,
      errors: null,
    },
  },
  reducers: {
    clearCreateLessonState: (state) => {
      state.createLesson = {
        isLoading: false,
        errors: null,
        data: null,
      };
    },
    clearCurrentLesson: (state) => {
      state.currentLesson = {
        data: null,
        isLoading: false,
        errors: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPairsOnDate.pending, (state) => {
        state.pairs.isLoading = true;
        state.pairs.errors = null;
      })
      .addCase(getPairsOnDate.fulfilled, (state, action) => {
        state.pairs.isLoading = false;
        state.pairs.data = action.payload;
      })
      .addCase(getPairsOnDate.rejected, (state, action) => {
        state.pairs.isLoading = false;
        state.pairs.errors = action.payload;
      })
      .addCase(createLesson.pending, (state) => {
        state.createLesson.isLoading = true;
        state.createLesson.errors = null;
        state.createLesson.data = null;
      })
      .addCase(createLesson.fulfilled, (state, action) => {
        state.createLesson.isLoading = false;
        state.createLesson.data = action.payload;
      })
      .addCase(createLesson.rejected, (state, action) => {
        state.createLesson.isLoading = false;
        state.createLesson.errors = action.payload;
      })
      .addCase(getLessonDataById.pending, (state) => {
        state.currentLesson.isLoading = true;
        state.currentLesson.errors = null;
        state.currentLesson.data = null;
      })
      .addCase(getLessonDataById.fulfilled, (state, action) => {
        state.currentLesson.isLoading = false;
        state.currentLesson.data = action.payload;
      })
      .addCase(getLessonDataById.rejected, (state, action) => {
        state.currentLesson.isLoading = false;
        state.currentLesson.errors = action.payload;
      })
            .addCase(getLessonsForStudent.pending, (state) => {
        state.lessonsForStudent.isLoading = true;
        state.lessonsForStudent.errors = null;
        state.lessonsForStudent.data = null;
      })
      .addCase(getLessonsForStudent.fulfilled, (state, action) => {
        state.lessonsForStudent.isLoading = false;
        state.lessonsForStudent.data = action.payload;
      })
      .addCase(getLessonsForStudent.rejected, (state, action) => {
        state.lessonsForStudent.isLoading = false;
        state.lessonsForStudent.errors = action.payload;
      });
  },
});

export const { clearCreateLessonState, clearCurrentLesson } =
  lessonSlice.actions;
export default lessonSlice.reducer;
