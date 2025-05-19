import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import TypeOfSemesterService from "../../services/TypeOfSemesterService";

export const fetchTypeOfSemesters = createAsyncThunk(
  "typeOfSemesters/fetchTypeOfSemesters",
  async (params, { rejectWithValue }) => {
    try {
      const response = await TypeOfSemesterService.getAll(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createTypeOfSemester = createAsyncThunk(
  "typeOfSemesters/createTypeOfSemester",
  async (semesterData, { rejectWithValue }) => {
    try {
      const response = await TypeOfSemesterService.create(semesterData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateTypeOfSemester = createAsyncThunk(
  "typeOfSemesters/updateTypeOfSemester",
  async ({ id, semesterData }, { rejectWithValue }) => {
    try {
      const response = await TypeOfSemesterService.update(id, semesterData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteTypeOfSemester = createAsyncThunk(
  "typeOfSemesters/deleteTypeOfSemester",
  async (id, { rejectWithValue }) => {
    try {
      await TypeOfSemesterService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const typeOfSemesterSlice = createSlice({
  name: "typeOfSemesters",
  initialState: {
    data: [],
    isLoading: false,
    errors: [],
    currentSemester: null,
    meta: {
      total: 0,
      page: 1,
      limit: 5
    },
    searchParams: {
      nameQuery: '',
      startDateQuery: '',
      endDateQuery: ''
    }
  },
  reducers: {
    clearErrors: (state) => {
      state.errors = [];
    },
    clearCurrentSemester: (state) => {
      state.currentSemester = null;
    },
    setPage: (state, action) => {
      state.meta.page = action.payload;
    },
    setLimit: (state, action) => {
      state.meta.limit = action.payload;
    },
    setSearchParams: (state, action) => {
      state.searchParams = { ...state.searchParams, ...action.payload };
      state.meta.page = 1; // Reset to first page when search changes
    },
    setCurrentSemester: (state, action) => {
      state.currentSemester = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all semesters
      .addCase(fetchTypeOfSemesters.pending, (state) => {
        state.isLoading = true;
        state.errors = [];
      })
      .addCase(fetchTypeOfSemesters.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data || action.payload;
        state.meta.total = action.payload.meta?.totalItems || action.payload.length;
      })
      .addCase(fetchTypeOfSemesters.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload ? [action.payload] : [{ message: "Unknown error" }];
      })
      
      // Create semester
      .addCase(createTypeOfSemester.pending, (state) => {
        state.isLoading = true;
        state.errors = [];
      })
      .addCase(createTypeOfSemester.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = [action.payload, ...state.data];
        state.meta.total += 1;
      })
      .addCase(createTypeOfSemester.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload ? [action.payload] : [{ message: "Unknown error" }];
      })
      
      // Update semester
      .addCase(updateTypeOfSemester.pending, (state) => {
        state.isLoading = true;
        state.errors = [];
      })
      .addCase(updateTypeOfSemester.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = state.data.map(semester => 
          semester.id === action.payload.id ? action.payload : semester
        );
        state.currentSemester = null;
      })
      .addCase(updateTypeOfSemester.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload ? [action.payload] : [{ message: "Unknown error" }];
      })
      
      // Delete semester
      .addCase(deleteTypeOfSemester.pending, (state) => {
        state.isLoading = true;
        state.errors = [];
      })
      .addCase(deleteTypeOfSemester.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = state.data.filter(semester => semester.id !== action.payload);
        state.meta.total -= 1;
      })
      .addCase(deleteTypeOfSemester.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload ? [action.payload] : [{ message: "Unknown error" }];
      });
  }
});

export const { 
  clearErrors, 
  clearCurrentSemester,
  setCurrentSemester,
  setPage, 
  setLimit, 
  setSearchParams 
} = typeOfSemesterSlice.actions;

export default typeOfSemesterSlice.reducer;