import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import CurriculumSubjectService from '../../services/CurriculumSubjectService';
import CurriculumSubjectDto from '../../DTOs/Data/CurriculumSubjectDto';
import MetaDataDto from '../../DTOs/Data/MetaDataDto';
import CurriculumSubjectDtoForCreation from '../../DTOs/ForCreation/CurriculumSubjectDtoForCreation';

export const fetchCurriculumSubjects = createAsyncThunk(
  'curriculumSubject/fetchCurriculumSubjects',
  async (curriculumId , { rejectWithValue }) => {
    try {
      const response = await CurriculumSubjectService.getAlls(curriculumId);
      const resultData = response.data.map((element)=> new CurriculumSubjectDto(element));
      const resultMeta =  new MetaDataDto(response.meta)
      return {data:resultData, meta: resultMeta};
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addCurriculumSubject = createAsyncThunk(
  'curriculumSubject/addCurriculumSubject',
  async ({ curriculumId, data }, { rejectWithValue }) => {
    try {
      const dataDto = new CurriculumSubjectDtoForCreation(data);
      const response = await CurriculumSubjectService.create( curriculumId, dataDto);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCurriculumSubject = createAsyncThunk(
  'curriculumSubject/updateCurriculumSubject',
  async ({ id, subjectData }, { rejectWithValue }) => {
    try {
      const response = await CurriculumSubjectService.update(id, subjectData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteCurriculumSubject = createAsyncThunk(
  'curriculumSubject/deleteCurriculumSubject',
  async (id, { rejectWithValue }) => {
    try {
      await CurriculumSubjectService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const curriculumSubjectSlice = createSlice({
  name: 'curriculumSubject',
  initialState: {
    data: [],
    meta: {
      total: 0,
      totalPage: 0,
      limit: 10,
      page: 1
    },
    isLoading: false,
    error: null,
    currentSubject: null
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearCurrentSubject: (state) => {
      state.currentSubject = null;
    },
    setCurrentSubject: (state, action) => {
      state.currentSubject = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Получение предметов учебного плана
      .addCase(fetchCurriculumSubjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurriculumSubjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data;
        state.meta = action.payload.meta;

      })
      .addCase(fetchCurriculumSubjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch curriculum subjects';
      })

      // Добавление предмета в учебный план
      .addCase(addCurriculumSubject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addCurriculumSubject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data.unshift(action.payload.data);
        state.meta.total += 1;
      })
      .addCase(addCurriculumSubject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to add curriculum subject';
      })

      // Обновление предмета в учебном плане
      .addCase(updateCurriculumSubject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCurriculumSubject.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedSubject = action.payload.data;
        state.data = state.data.map(subject =>
          subject.subject.id === updatedSubject.subject.id ? updatedSubject : subject
        );
      })
      .addCase(updateCurriculumSubject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to update curriculum subject';
      })

      // Удаление предмета из учебного плана
      .addCase(deleteCurriculumSubject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCurriculumSubject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = state.data.filter(
          subject => subject.subject.id !== action.payload
        );
        state.meta.total -= 1;
      })
      .addCase(deleteCurriculumSubject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to delete curriculum subject';
      });
  }
});

export const { 
  clearErrors, 
  clearCurrentSubject, 
  setCurrentSubject 
} = curriculumSubjectSlice.actions;

export default curriculumSubjectSlice.reducer;