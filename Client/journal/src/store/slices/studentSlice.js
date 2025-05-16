// studentsSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import StudentService from "../../services/StudentService";

// Асинхронные действия
export const fetchStudents = createAsyncThunk(
  "students/fetchAll",
  async (params = {}, { rejectWithValue, getState }) => {
    try {
      const { students } = getState();
      const fullParams = {
        ...params,
        limit: params.limit || students.meta.limit,
        page: params.page || students.meta.page,
        sortBy: params.sortBy || "person.surname",
        sortOrder: params.sortOrder || "ASC",
        ...students.searchParams, // Добавляем текущие параметры поиска
      };

      const response = await StudentService.getAllStudents(fullParams);
      return {
        data: response.data,
        meta: response.meta,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getStudentsOnLesson = createAsyncThunk(
  "students/getStudentsOnLesson", // Изменил тип действия чтобы не конфликтовало с fetchStudents
  async (
    { groupIdQuery = null, subgroupIdQuery = null },
    { rejectWithValue }
  ) => {
    try {
      const response = await StudentService.getAllStudents({
        groupIdQuery,
        subgroupIdQuery,
        limit: 100,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createStudent = createAsyncThunk(
  "students/create",
  async (studentData, { rejectWithValue }) => {
    try {
      const response = await StudentService.createStudent(studentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateStudent = createAsyncThunk(
  "students/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await StudentService.updateStudent(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteStudent = createAsyncThunk(
  "students/delete",
  async (id, { rejectWithValue }) => {
    try {
      await StudentService.deleteStudent(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getStudentById = createAsyncThunk(
  "students/getById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await StudentService.getStudentById(id);
      console.log(response);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const studentsSlice = createSlice({
  name: "students",
  initialState: {
    data: [],
    studentsOnLesson: {},
    currentStudent: null,
    isLoading: false,
    errors: [],
    meta: {
      total: 0,
      totalPages: 0,
      limit: 5,
      page: 1,
    },
    searchParams: {
      idQuery: "",
      surnameQuery: "",
      nameQuery: "",
      groupQuery: "",
      subgroupQuery: "",
      parentQuery: "",
      reprimandQuery: "",
    },
  },
  reducers: {
    clearErrors: (state) => {
      state.errors = [];
    },
    clearCurrentStudent: (state) => {
      state.currentStudent = null;
    },
    setPage: (state, action) => {
      state.meta.page = action.payload;
    },
    setLimit: (state, action) => {
      state.meta.limit = action.payload;
    },
    setSearchParams: (state, action) => {
      state.searchParams = { ...state.searchParams, ...action.payload };
      state.meta.page = 1;
    },
    clearStudentsOnLesson: (state) => {
      state.studentsOnLesson = []; // Новый редьюсер для очистки студентов на занятии
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.isLoading = true;
        state.errors = [];
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data;
        state.meta = {
          ...state.meta,
          ...action.payload.meta,
          totalPages: Math.ceil(action.payload.meta.total / state.meta.limit),
        };
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = Array.isArray(action.payload)
          ? action.payload
          : [{ message: action.payload }];
      })

      .addCase(getStudentsOnLesson.pending, (state) => {
        state.studentsOnLesson.isLoading = true;
        state.studentsOnLesson.errors = null;
      })
      .addCase(getStudentsOnLesson.fulfilled, (state, action) => {
        state.studentsOnLesson.isLoading = false;
        state.studentsOnLesson.data = action.payload;
      })
      .addCase(getStudentsOnLesson.rejected, (state, action) => {
        state.studentsOnLesson.isLoading = false;
        state.studentsOnLesson.errors = action.payload;
      })

      .addCase(createStudent.pending, (state) => {
        state.isLoading = true;
        state.errors = [];
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data.unshift(action.payload);
        state.meta.total += 1;
        state.meta.totalPages = Math.ceil(state.meta.total / state.meta.limit);
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = Array.isArray(action.payload)
          ? action.payload
          : [{ message: action.payload }];
      })

      .addCase(updateStudent.pending, (state) => {
        state.isLoading = true;
        state.errors = [];
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.isLoading = false;
        const updated = action.payload;
        state.data = state.data.map((student) =>
          student.id === updated.id ? updated : student
        );
        if (state.currentStudent?.id === updated.id) {
          state.currentStudent = updated;
        }
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = Array.isArray(action.payload)
          ? action.payload
          : [{ message: action.payload }];
      })

      .addCase(deleteStudent.pending, (state) => {
        state.isLoading = true;
        state.errors = [];
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = state.data.filter(
          (student) => student.id !== action.payload
        );
        state.meta.total -= 1;
        state.meta.totalPages = Math.ceil(state.meta.total / state.meta.limit);
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = Array.isArray(action.payload)
          ? action.payload
          : [{ message: action.payload }];
      })

      .addCase(getStudentById.pending, (state) => {
        state.isLoading = true;
        state.errors = [];
      })
      .addCase(getStudentById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentStudent = action.payload;
      })
      .addCase(getStudentById.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = Array.isArray(action.payload)
          ? action.payload
          : [{ message: action.payload }];
      });
  },
});

export const {
  clearErrors,
  clearCurrentStudent,
  setPage,
  setLimit,
  setSearchParams,
  clearStudentsOnLesson, // Экспортируем новый action
} = studentsSlice.actions;

export default studentsSlice.reducer;
