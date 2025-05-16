import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AbsenteeismService from "../../services/AbsenteeismService";

// Асинхронные действия
export const getForStudent = createAsyncThunk(
  "absenteeism/getForStudent",
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await AbsenteeismService.getForStudent(studentId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateAbsenteeism = createAsyncThunk(
  "absenteeism/updateAbsenteeism",
  async ({ absenteeismId, data }, { rejectWithValue }) => {
    try {
      const response = await AbsenteeismService.update(absenteeismId, data);
      return response.data; // Используем response.data для согласованности
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createAbsenteeism = createAsyncThunk(
  "absenteeism/createAbsenteeism",
  async (data, { rejectWithValue }) => {
    try {
      const response = await AbsenteeismService.create(data);
      return response.data; // Используем response.data для согласованности
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getAllAbsenteeismForLesson = createAsyncThunk(
  "absenteeism/getAllAbsenteeismForLesson",
  async (lessonIdQuery, { rejectWithValue }) => {
    try {
      const response = await AbsenteeismService.getAlls({ lessonIdQuery });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteAbsenteeism = createAsyncThunk(
  "absenteeism/deleteAbsenteeism",
  async (absenteeismId, { rejectWithValue }) => {
    try {
      await AbsenteeismService.delete(absenteeismId);
      return absenteeismId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const absenteeismSlice = createSlice({
  name: "absenteeism",
  initialState: {
    studentAbsenteeism: {
      isLoading: false,
      errors: null,
      data: null,
    },
    lessonAbsenteeism: {
      isLoading: false,
      errors: null,
      data: [],
      meta: null,
    },
    createStatus: {
      isLoading: false,
      errors: null,
      data: null,
    },
    updateStatus: {
      isLoading: false,
      errors: null,
      success: false,
    },
    deleteStatus: {
      isLoading: false,
      errors: null,
      success: false,
    },
  },
  reducers: {
    clearLessonAbsenteeism: (state) => {
      state.lessonAbsenteeism = {
        isLoading: false,
        errors: null,
        data: [],
        meta: null,
      };
    },
    resetCreateStatus: (state) => {
      state.createStatus = {
        isLoading: false,
        errors: null,
        data: null,
      };
    },
    resetUpdateStatus: (state) => {
      state.updateStatus = {
        isLoading: false,
        errors: null,
        success: false,
      };
    },
    resetDeleteStatus: (state) => {
      state.deleteStatus = {
        isLoading: false,
        errors: null,
        success: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Обработка getForStudent
      .addCase(getForStudent.pending, (state) => {
        state.studentAbsenteeism.isLoading = true;
        state.studentAbsenteeism.errors = null;
      })
      .addCase(getForStudent.fulfilled, (state, action) => {
        state.studentAbsenteeism.isLoading = false;
        state.studentAbsenteeism.data = action.payload;
      })
      .addCase(getForStudent.rejected, (state, action) => {
        state.studentAbsenteeism.isLoading = false;
        state.studentAbsenteeism.errors = action.payload;
      })

      // Обработка getAllAbsenteeismForLesson
      .addCase(getAllAbsenteeismForLesson.pending, (state) => {
        state.lessonAbsenteeism.isLoading = true;
        state.lessonAbsenteeism.errors = null;
      })
      .addCase(getAllAbsenteeismForLesson.fulfilled, (state, action) => {
        state.lessonAbsenteeism.isLoading = false;
        state.lessonAbsenteeism.data = action.payload.data || action.payload;
        state.lessonAbsenteeism.meta = action.payload.meta || null;
      })
      .addCase(getAllAbsenteeismForLesson.rejected, (state, action) => {
        state.lessonAbsenteeism.isLoading = false;
        state.lessonAbsenteeism.errors = action.payload;
      })

      // Обработка createAbsenteeism
      .addCase(createAbsenteeism.pending, (state) => {
        state.createStatus.isLoading = true;
        state.createStatus.errors = null;
        state.createStatus.data = null;
      })
      .addCase(createAbsenteeism.fulfilled, (state, action) => {
        state.createStatus.isLoading = false;
        state.createStatus.data = action.payload;
        if (Array.isArray(state.lessonAbsenteeism.data)) {
          state.lessonAbsenteeism.data = [...state.lessonAbsenteeism.data, action.payload];
        } else {
          state.lessonAbsenteeism.data = [action.payload];
        }
      })
      .addCase(createAbsenteeism.rejected, (state, action) => {
        state.createStatus.isLoading = false;
        state.createStatus.errors = action.payload;
      })

      // Обработка updateAbsenteeism
      .addCase(updateAbsenteeism.pending, (state) => {
        state.updateStatus.isLoading = true;
        state.updateStatus.errors = null;
        state.updateStatus.success = false;
      })
      .addCase(updateAbsenteeism.fulfilled, (state, action) => {
        state.updateStatus.isLoading = false;
        state.updateStatus.success = true;
        if (Array.isArray(state.lessonAbsenteeism.data)) {
          state.lessonAbsenteeism.data = state.lessonAbsenteeism.data.map(item => 
            item.id === action.payload.id ? action.payload : item
          );
        }
      })
      .addCase(updateAbsenteeism.rejected, (state, action) => {
        state.updateStatus.isLoading = false;
        state.updateStatus.errors = action.payload;
      })

      // Обработка deleteAbsenteeism
      .addCase(deleteAbsenteeism.pending, (state) => {
        state.deleteStatus.isLoading = true;
        state.deleteStatus.errors = null;
        state.deleteStatus.success = false;
      })
      .addCase(deleteAbsenteeism.fulfilled, (state, action) => {
        state.deleteStatus.isLoading = false;
        state.deleteStatus.success = true;
        if (Array.isArray(state.lessonAbsenteeism.data)) {
          state.lessonAbsenteeism.data = state.lessonAbsenteeism.data.filter(
            (item) => item.id !== action.payload
          );
        }
      })
      .addCase(deleteAbsenteeism.rejected, (state, action) => {
        state.deleteStatus.isLoading = false;
        state.deleteStatus.errors = action.payload;
      });
  },
});

export const { 
  clearLessonAbsenteeism, 
  resetCreateStatus, 
  resetUpdateStatus,
  resetDeleteStatus 
} = absenteeismSlice.actions;

export default absenteeismSlice.reducer;