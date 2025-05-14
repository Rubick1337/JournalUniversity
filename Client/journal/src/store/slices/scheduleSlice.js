import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ScheduleService from '../../services/scheduleService';

// Async Thunks
export const fetchScheduleForStudent = createAsyncThunk(
    'schedule/fetchForStudent',
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

export const fetchSemesterByDate = createAsyncThunk(
    'schedule/fetchSemesterByDate',
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
    'schedule/fetchByDate',
    async (date, { rejectWithValue }) => {
        try {
            const response = await ScheduleService.getScheduleByDate(date);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Slice
const scheduleSlice = createSlice({
    name: 'schedule',
    initialState: {
        studentSchedule: null,
        currentSemester: null,
        currentSchedule: null,
        isLoading: false,
        errors: [],
        dateParams: {
            date: null,
            weekdayNumber: null,
            weekType: null,
            studentId: null }
    },
    reducers: {
        clearScheduleErrors: (state) => {
            state.errors = [];
        },
        clearStudentSchedule: (state) => {
            state.studentSchedule = null;
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
                ...action.payload
            };
        }
    },
    extraReducers: (builder) => {
        builder
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
                    studentId: action.meta?.arg?.studentId || null // Сохраняем studentId
                };
            })
            .addCase(fetchScheduleForStudent.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
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
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
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
            })
            .addCase(fetchScheduleByDate.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            });
    }
});

export const {
    clearScheduleErrors,
    clearStudentSchedule,
    clearCurrentSemester,
    clearCurrentSchedule,
    setDateParams
} = scheduleSlice.actions;

export default scheduleSlice.reducer;