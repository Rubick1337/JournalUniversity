import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ScheduleService from "../../services/scheduleService";

// Async Thunks
export const fetchScheduleForStudent = createAsyncThunk(
  "schedule/fetchForStudent",
  async ({ studentId, date, weekdayNumber, weekType }, { rejectWithValue }) => {
    try {
      const response = await ScheduleService.getScheduleForStudent(
        studentId,
        date,
        weekdayNumber,
        weekType
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// Async Thunks
export const fetchLessonsForStudent = createAsyncThunk(
  "schedule/fetchLessonsForStudent",
  async ({ studentId, date }, { rejectWithValue }) => {
    try {
      const response = await ScheduleService.getLessonsForStudent({
        studentId,
        date,
      });
      console.log("responser", response);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const fetchScheduleForTeacher = createAsyncThunk(
  "schedule/fetchForTeacher",
  async ({ teacherId, date, weekdayNumber, weekType }, { rejectWithValue }) => {
    try {
      const response = await ScheduleService.getScheduleForTeacher({
        teacherId,
        date,
        weekdayNumber,
        weekType,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const fetchSemesterByDate = createAsyncThunk(
  "schedule/fetchSemesterByDate",
  async (date, { rejectWithValue }) => {
    try {
      const response = await ScheduleService.getSemesterByDate(date);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchScheduleByDate = createAsyncThunk(
  "schedule/fetchByDate",
  async (date, { rejectWithValue }) => {
    try {
      const response = await ScheduleService.getScheduleByDate(date);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const fetchSchedules = createAsyncThunk(
  "schedules/fetchAll",
  async (
    {
      page = 1,
      limit = 10,
      sortBy = "id",
      sortOrder = "asc",
      nameQuery = "",
      dateQuery = "",
      semesterTypeQuery = "",
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await ScheduleService.getAll({
        page,
        limit,
        sortBy,
        sortOrder,
        nameQuery,
        dateQuery,
        semesterTypeQuery,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createSchedule = createAsyncThunk(
  "schedules/create",
  async (scheduleData, { rejectWithValue }) => {
    try {
      const response = await ScheduleService.create(scheduleData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateSchedule = createAsyncThunk(
  "schedules/update",
  async ({ id, scheduleData }, { rejectWithValue }) => {
    try {
      const response = await ScheduleService.update(id, scheduleData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteSchedule = createAsyncThunk(
  "schedules/delete",
  async (id, { rejectWithValue }) => {
    try {
      await ScheduleService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const scheduleSlice = createSlice({
  name: "schedule",
  initialState: {
    // Для редакций расписаний
    schedules: [],
    currentScheduleEdition: null,
    schedulesLoading: false,
    schedulesErrors: [],
    teacherSchedule: null,

    // Для событий расписания (существующие данные)
    studentSchedule: null,
    studentLessons: null,
    currentSemester: null,
    currentSchedule: null,
    isLoading: false,
    errors: [],
    dateParams: {
      date: null,
      weekdayNumber: null,
      weekType: null,
      studentId: null,
    },
    meta: {
      total: 0,
      page: 1,
      limit: 10,
    },
    searchParams: {
      nameQuery: "",
      dateQuery: "",
      semesterTypeQuery: "",
    },
  },
  reducers: {
    clearScheduleErrors: (state) => {
      state.errors = [];
      state.schedulesErrors = [];
    },
    clearTeacherSchedule: (state) => {
      state.teacherSchedule = null;
    },
    clearCurrentScheduleEdition: (state) => {
      state.currentScheduleEdition = null;
    },
    clearStudentSchedule: (state) => {
      state.studentSchedule = null;
    },
    clearStudentLessons: (state) => {
      state.studentLessons = null;
    },
    clearCurrentSemester: (state) => {
      state.currentSemester = null;
    },
    clearCurrentSchedule: (state) => {
      state.currentSchedule = null;
    },
    setDateParams: (state, action) => {
      state.dateParams = {
        ...state.dateParams,
        ...action.payload,
      };
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
  },
  extraReducers: (builder) => {
    builder
      // Fetch Schedules (редакции расписаний)
      .addCase(fetchSchedules.pending, (state) => {
        state.schedulesLoading = true;
        state.schedulesErrors = [];
      })
      .addCase(fetchSchedules.fulfilled, (state, action) => {
        state.schedulesLoading = false;
        state.schedules = action.payload.data;
        state.meta = {
          ...state.meta,
          total: action.payload.meta?.total || 0,
          page: action.payload.meta?.currentPage || 1,
          limit: action.payload.meta?.perPage || 10,
        };
      })
      .addCase(fetchSchedules.rejected, (state, action) => {
        state.schedulesLoading = false;
        state.schedulesErrors = action.payload
          ? [action.payload]
          : [{ message: "Unknown error" }];
      })
      // Fetch LessonsForStudent
      .addCase(fetchLessonsForStudent.pending, (state) => {
        state.schedulesLoading = true;
        state.schedulesErrors = [];
      })
      .addCase(fetchLessonsForStudent.fulfilled, (state, action) => {
        state.schedulesLoading = false;
        state.studentLessons = action.payload.data;
      })
      .addCase(fetchLessonsForStudent.rejected, (state, action) => {
        state.schedulesLoading = false;
        state.schedulesErrors = action.payload
          ? [action.payload]
          : [{ message: "Unknown error" }];
      })
      // Fetch Schedule For Teacher
      .addCase(fetchScheduleForTeacher.pending, (state) => {
        state.isLoading = true;
        state.errors = [];
      })
      .addCase(fetchScheduleForTeacher.fulfilled, (state, action) => {
        state.isLoading = false;
        state.teacherSchedule = action.payload.data; // Сохраняем данные преподавателя
        state.dateParams = {
          ...state.dateParams,
          date: action.payload.data.dateInfo?.date || null,
          weekdayNumber: action.payload.data.dateInfo?.weekdayNumber || null,
          weekType: action.payload.data.dateInfo?.weekType || null,
          teacherId: action.meta?.arg?.teacherId || null,
        };
      })
      .addCase(fetchScheduleForTeacher.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload
          ? [action.payload]
          : [{ message: "Unknown error" }];
      })
      // Create Schedule (редакция расписания)
      .addCase(createSchedule.pending, (state) => {
        state.schedulesLoading = true;
        state.schedulesErrors = [];
      })
      .addCase(createSchedule.fulfilled, (state, action) => {
        state.schedulesLoading = false;
        state.schedules = [action.payload, ...state.schedules];
        state.meta.total += 1;
      })
      .addCase(createSchedule.rejected, (state, action) => {
        state.schedulesLoading = false;
        state.schedulesErrors = action.payload
          ? [action.payload]
          : [{ message: "Unknown error" }];
      })

      // Update Schedule (редакция расписания)
      .addCase(updateSchedule.pending, (state) => {
        state.schedulesLoading = true;
        state.schedulesErrors = [];
      })
      .addCase(updateSchedule.fulfilled, (state, action) => {
        state.schedulesLoading = false;
        state.schedules = state.schedules.map((schedule) =>
          schedule.id === action.payload.id ? action.payload : schedule
        );
      })
      .addCase(updateSchedule.rejected, (state, action) => {
        state.schedulesLoading = false;
        state.schedulesErrors = action.payload
          ? [action.payload]
          : [{ message: "Unknown error" }];
      })

      // Delete Schedule (редакция расписания)
      .addCase(deleteSchedule.pending, (state) => {
        state.schedulesLoading = true;
        state.schedulesErrors = [];
      })
      .addCase(deleteSchedule.fulfilled, (state, action) => {
        state.schedulesLoading = false;
        state.schedules = state.schedules.filter(
          (schedule) => schedule.id !== action.payload
        );
        state.meta.total -= 1;
      })
      .addCase(deleteSchedule.rejected, (state, action) => {
        state.schedulesLoading = false;
        state.schedulesErrors = action.payload
          ? [action.payload]
          : [{ message: "Unknown error" }];
      })

      // Fetch Schedule For Student
      .addCase(fetchScheduleForStudent.pending, (state) => {
        state.isLoading = true;
        state.errors = [];
      })
      .addCase(fetchScheduleForStudent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.studentSchedule = action.payload;
        state.dateParams = {
          ...state.dateParams,
          date: action.payload.dateInfo?.date || null,
          weekdayNumber: action.payload.dateInfo?.weekdayNumber || null,
          weekType: action.payload.dateInfo?.weekType || null,
          studentId: action.meta?.arg?.studentId || null,
        };
        if (action.payload.events) {
          state.meta.total = action.payload.events.length;
        }
      })
      .addCase(fetchScheduleForStudent.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload
          ? [action.payload]
          : [{ message: "Unknown error" }];
      })

      // Fetch Semester By Date
      .addCase(fetchSemesterByDate.pending, (state) => {
        state.isLoading = true;
        state.errors = [];
      })
      .addCase(fetchSemesterByDate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSemester = action.payload;
        if (action.payload.date) {
          state.dateParams.date = action.payload.date;
        }
      })
      .addCase(fetchSemesterByDate.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload
          ? [action.payload]
          : [{ message: "Unknown error" }];
      })

      // Fetch Schedule By Date
      .addCase(fetchScheduleByDate.pending, (state) => {
        state.isLoading = true;
        state.errors = [];
      })
      .addCase(fetchScheduleByDate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSchedule = action.payload;
        if (action.payload.date) {
          state.dateParams.date = action.payload.date;
        }
        if (action.payload.events) {
          state.meta.total = action.payload.events.length;
        }
      })
      .addCase(fetchScheduleByDate.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload
          ? [action.payload]
          : [{ message: "Unknown error" }];
      });
  },
});

export const {
  clearScheduleErrors,
  clearCurrentScheduleEdition,
  clearStudentSchedule,
  clearCurrentSemester,
  clearCurrentSchedule,
  setDateParams,
  setPage,
  setLimit,
  clearTeacherSchedule,
  clearStudentLessons,
  setSearchParams,
} = scheduleSlice.actions;

export default scheduleSlice.reducer;
