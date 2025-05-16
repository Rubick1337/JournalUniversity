import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import TeacherService from "../../services/TeacherService";

// Асинхронные действия
export const fetchTeachers = createAsyncThunk(
  "teachers/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      console.log("params", params);
      const response = await TeacherService.getAll(params);
      console.log("test,",response)
      return {
        data: response.data,
        meta: response.meta,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createTeacher = createAsyncThunk(
  "teachers/create",
  async (teacherData, { rejectWithValue }) => {
    console.log("Data before API call:", teacherData);
    try {
      const response = await TeacherService.create(teacherData);
      console.log("API response:", response);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateTeacher = createAsyncThunk(
  "teachers/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await TeacherService.update(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteTeacher = createAsyncThunk(
  "teachers/delete",
  async (id, { rejectWithValue }) => {
    try {
      await TeacherService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getTeacherById = createAsyncThunk(
  "teachers/getById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await TeacherService.getById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getTeacherWithDetails = createAsyncThunk(
  "teachers/getWithDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await TeacherService.getTeacherWithDetails(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const teacherSlice = createSlice({
  name: "teachers",
  initialState: {
    data: [],
    currentTeacher: {},
    isLoading: false,
    errors: [],
    meta: {
      total: 0,
      totalPages: 0,
      limit: 10,
      page: 1,
    },
    searchParams: {
      idQuery: "",
      personQuery: "",
      departmentQuery: "",
      positionQuery: "",
    },
  },
  reducers: {
    clearErrors: (state) => {
      state.errors = [];
    },
    clearCurrentTeacher: (state) => {
      state.currentTeacher = null;
    },
    setPage: (state, action) => {
      state.meta.page = action.payload;
    },
    setLimit: (state, action) => {
      state.meta.limit = action.payload;
    },
    setSearchParams: (state, action) => {
      state.searchParams = { ...state.searchParams, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeachers.pending, (state) => {
        state.isLoading = true;
        state.errors = [];
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data;
        state.meta = {
          ...state.meta,
          ...action.payload.meta,
          totalPages: Math.ceil(action.payload.meta.total / state.meta.limit),
        };
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = Array.isArray(action.payload)
          ? action.payload
          : [{ message: action.payload }];
      })

      .addCase(createTeacher.pending, (state) => {
        state.isLoading = true;
        state.errors = [];
      })
      .addCase(createTeacher.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data.unshift(action.payload);
        state.meta.total += 1;
        state.meta.totalPages = Math.ceil(state.meta.total / state.meta.limit);
      })
      .addCase(createTeacher.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = Array.isArray(action.payload)
          ? action.payload
          : [{ message: action.payload }];
      })

      .addCase(updateTeacher.pending, (state) => {
        state.isLoading = true;
        state.errors = [];
      })
      .addCase(updateTeacher.fulfilled, (state, action) => {
        state.isLoading = false;
        const updated = action.payload;
        state.data = state.data.map((teacher) =>
          teacher.id === updated.id ? updated : teacher
        );
        if (state.currentTeacher?.id === updated.id) {
          state.currentTeacher = updated;
        }
      })
      .addCase(updateTeacher.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = Array.isArray(action.payload)
          ? action.payload
          : [{ message: action.payload }];
      })

      .addCase(deleteTeacher.pending, (state) => {
        state.isLoading = true;
        state.errors = [];
      })
      .addCase(deleteTeacher.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = state.data.filter(
          (teacher) => teacher.id !== action.payload
        );
        state.meta.total -= 1;
        state.meta.totalPages = Math.ceil(state.meta.total / state.meta.limit);
      })
      .addCase(deleteTeacher.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = Array.isArray(action.payload)
          ? action.payload
          : [{ message: action.payload }];
      })

      .addCase(getTeacherById.pending, (state) => {
        state.isLoading = true;
        state.errors = [];
      })
      .addCase(getTeacherById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTeacher = action.payload;
      })
      .addCase(getTeacherById.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = Array.isArray(action.payload)
          ? action.payload
          : [{ message: action.payload }];
      })

      .addCase(getTeacherWithDetails.pending, (state) => {
        state.isLoading = true;
        state.errors = [];
      })
      .addCase(getTeacherWithDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTeacher = action.payload;
      })
      .addCase(getTeacherWithDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = Array.isArray(action.payload)
          ? action.payload
          : [{ message: action.payload }];
      });
  },
});

export const {
  clearErrors,
  clearCurrentTeacher,
  setPage,
  setLimit,
  setSearchParams,
} = teacherSlice.actions;

export default teacherSlice.reducer;
