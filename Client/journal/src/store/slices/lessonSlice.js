import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import LessonService from "../../services/LessonService";

export const createAvsenteeism = createAsyncThunk(
  "lesson/createAvsenteeism",
  async (data, { rejectWithValue }) => {
    try {
      const response = await LessonService.create(data);
      return response;
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
      return response.data; // Возвращаем response.data, так как данные приходят в поле data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const lessonSlice = createSlice({
  name: "lesson",
  initialState: {
    pairs: {
      isLoading: false,
      errors: null, // Исправлено опечатку erros -> errors
      data: [],
    },
    studentlesson: { // Добавлено для совместимости с существующим кодом
      isLoading: false,
      errors: null,
      data: [],
    }
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Обработчики для getPairsOnDate
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

  },
});

export default lessonSlice.reducer;