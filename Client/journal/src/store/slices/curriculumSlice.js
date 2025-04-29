import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import CurriculumService from '../../services/CurriculumService';

// Асинхронные действия
export const fetchCurriculums = createAsyncThunk(
  'curriculums/fetchCurriculums',
  async (_, { rejectWithValue }) => {
    try {
      const response = await CurriculumService.getAlls();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addCurriculum = createAsyncThunk(
  'curriculums/addCurriculum',
  async (curriculumData, { rejectWithValue }) => {
    try {
      const response = await CurriculumService.create(curriculumData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCurriculum = createAsyncThunk(
  'curriculums/updateCurriculum',
  async ({ id, curriculumData }, { rejectWithValue }) => {
    try {
      const response = await CurriculumService.update(id, curriculumData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteCurriculum = createAsyncThunk(
  'curriculums/deleteCurriculum',
  async (id, { rejectWithValue }) => {
    try {
      await CurriculumService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getCurriculumById = createAsyncThunk(
  'curriculums/getCurriculumById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await CurriculumService.getById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Создаем слайс
const curriculumSlice = createSlice({
  name: 'curriculums',
  initialState: {
    data: [],
    currentCurriculum: null,
    isLoading: false,
    errors: [],
  },
  reducers: {
    clearErrors: (state) => {
      state.errors = [];
    },
    clearCurrentCurriculum: (state) => {
      state.currentCurriculum = null;
    },
    setCurrentCurriculum: (state, action) => {
      state.currentCurriculum = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Загрузка всех учебных расписаний
      .addCase(fetchCurriculums.pending, (state) => {
        state.isLoading = true;
        state.errors = [];
      })
      .addCase(fetchCurriculums.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchCurriculums.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = Array.isArray(action.payload)
          ? action.payload
          : [{ message: action.payload }];
      })

      // Добавление учебного расписания
      .addCase(addCurriculum.pending, (state) => {
        state.isLoading = true;
        state.errors = [];
      })
      .addCase(addCurriculum.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data.unshift(action.payload);
      })
      .addCase(addCurriculum.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = Array.isArray(action.payload)
          ? action.payload
          : [{ message: action.payload }];
      })

      // Обновление учебного расписания
      .addCase(updateCurriculum.pending, (state) => {
        state.isLoading = true;
        state.errors = [];
      })
      .addCase(updateCurriculum.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedCurriculum = action.payload;
        state.data = state.data.map(curriculum =>
          curriculum.id === updatedCurriculum.id ? updatedCurriculum : curriculum
        );
      })
      .addCase(updateCurriculum.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = Array.isArray(action.payload)
          ? action.payload
          : [{ message: action.payload }];
      })

      // Удаление учебного расписания
      .addCase(deleteCurriculum.pending, (state) => {
        state.isLoading = true;
        state.errors = [];
      })
      .addCase(deleteCurriculum.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = state.data.filter(curriculum => curriculum.id !== action.payload);
      })
      .addCase(deleteCurriculum.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = Array.isArray(action.payload)
          ? action.payload
          : [{ message: action.payload }];
      })

      // Получение учебного расписания по ID
      .addCase(getCurriculumById.pending, (state) => {
        state.isLoading = true;
        state.errors = [];
      })
      .addCase(getCurriculumById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCurriculum = action.payload;
      })
      .addCase(getCurriculumById.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = Array.isArray(action.payload)
          ? action.payload
          : [{ message: action.payload }];
      });
  },
});

export const { clearErrors, clearCurrentCurriculum, setCurrentCurriculum } = curriculumSlice.actions;
export default curriculumSlice.reducer;