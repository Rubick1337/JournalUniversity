import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import TeacherPositionService from '../../services/TeacherPositionService';

// Асинхронные действия
export const fetchTeacherPositions = createAsyncThunk(
    'teacherPositions/fetchTeacherPositions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await TeacherPositionService.getAllTeacherPositions();
            return response;
        } catch (error) {
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
    },
    reducers: {
        clearErrors: (state) => {
            state.errors = [];
        },
        clearCurrentPosition: (state) => {
            state.currentPosition = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Загрузка всех должностей
            .addCase(fetchTeacherPositions.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(fetchTeacherPositions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchTeacherPositions.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            // Добавление должности
            .addCase(addTeacherPosition.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(addTeacherPosition.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data.unshift(action.payload);
            })
            .addCase(addTeacherPosition.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            // Обновление должности
            .addCase(updateTeacherPosition.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(updateTeacherPosition.fulfilled, (state, action) => {
                state.isLoading = false;
                const updatedPosition = action.payload;
                state.data = state.data.map(position =>
                    position.id === updatedPosition.id ? updatedPosition : position
                );
            })
            .addCase(updateTeacherPosition.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            // Удаление должности
            .addCase(deleteTeacherPosition.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(deleteTeacherPosition.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = state.data.filter(position => position.id !== action.payload);
            })
            .addCase(deleteTeacherPosition.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            // Получение должности по ID
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
    },
});

export const { clearErrors, clearCurrentPosition } = teacherPositionSlice.actions;
export default teacherPositionSlice.reducer;