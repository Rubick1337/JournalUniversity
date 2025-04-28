import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import TeacherPositionService from '../../services/TeacherPositionService';

// Асинхронные действия
export const fetchTeacherPositions = createAsyncThunk(
    'teacherPositions/fetchTeacherPositions',
    async (params, { rejectWithValue }) => {
        try {
            const response = await TeacherPositionService.getAllTeacherPositions(params);
            console.log('Teachingposition API response:', response); // Добавьте это
            return {
                data: response.data,
                meta: response.meta
            };
        } catch (error) {
            console.error('Teachingposition API error:', error); // И это
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addTeacherPosition = createAsyncThunk(
    'teacherPositions/addTeacherPosition',
    async (positionData, { rejectWithValue }) => {
        try {
            const response = await TeacherPositionService.createTeacherPosition(positionData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateTeacherPosition = createAsyncThunk(
    'teacherPositions/updateTeacherPosition',
    async ({ id, positionData }, { rejectWithValue }) => {
        try {
            const response = await TeacherPositionService.updateTeacherPosition(id, positionData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteTeacherPosition = createAsyncThunk(
    'teacherPositions/deleteTeacherPosition',
    async (id, { rejectWithValue }) => {
        try {
            await TeacherPositionService.deleteTeacherPosition(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getTeacherPositionById = createAsyncThunk(
    'teacherPositions/getTeacherPositionById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await TeacherPositionService.getTeacherPositionById(id);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Создаем слайс
const teacherPositionSlice = createSlice({
    name: 'teacherPositions',
    initialState: {
        data: [],
        currentPosition: null,
        isLoading: false,
        errors: [],
        meta: {
            total: 0,
            totalPage: 0,
            limit: 10,
            page: 1
        }
    },
    reducers: {
        clearErrors: (state) => {
            state.errors = [];
        },
        clearCurrentPosition: (state) => {
            state.currentPosition = null;
        },
        setPage: (state, action) => {
            state.meta.page = action.payload;
        },
        setLimit: (state, action) => {
            state.meta.limit = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Загрузка всех позиций
            .addCase(fetchTeacherPositions.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(fetchTeacherPositions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload.data;
                state.meta = action.payload.meta;
            })
            .addCase(fetchTeacherPositions.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            // Добавление позиции
            .addCase(addTeacherPosition.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(addTeacherPosition.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data.unshift(action.payload);
                state.meta.total += 1;
                state.meta.totalPage = Math.ceil(state.meta.total / state.meta.limit);
            })
            .addCase(addTeacherPosition.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            // Обновление позиции
            .addCase(updateTeacherPosition.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(updateTeacherPosition.fulfilled, (state, action) => {
                state.isLoading = false;
                const updated = action.payload;
                state.data = state.data.map(pos =>
                    pos.id === updated.id ? updated : pos
                );
            })
            .addCase(updateTeacherPosition.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            // Удаление позиции
            .addCase(deleteTeacherPosition.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(deleteTeacherPosition.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = state.data.filter(pos => pos.id !== action.payload);
                state.meta.total -= 1;
                state.meta.totalPage = Math.ceil(state.meta.total / state.meta.limit);
            })
            .addCase(deleteTeacherPosition.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            // Получение по ID
            .addCase(getTeacherPositionById.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(getTeacherPositionById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentPosition = action.payload;
            })
            .addCase(getTeacherPositionById.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            });
    }
});

export const {
    clearErrors,
    clearCurrentPosition,
    setPage,
    setLimit
} = teacherPositionSlice.actions;

export default teacherPositionSlice.reducer;
