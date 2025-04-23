import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AssessmentTypeService from '../../services/AssessmentTypeService';

// Асинхронные действия
export const fetchAssessmentTypes = createAsyncThunk(
    'assessmentTypes/fetchAssessmentTypes',
    async (_, { rejectWithValue }) => {
        try {
            const response = await AssessmentTypeService.getAlls();
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addAssessmentType = createAsyncThunk(
    'assessmentTypes/addAssessmentType',
    async (typeData, { rejectWithValue }) => {
        try {
            const response = await AssessmentTypeService.create(typeData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateAssessmentType = createAsyncThunk(
    'assessmentTypes/updateAssessmentType',
    async ({ id, typeData }, { rejectWithValue }) => {
        try {
            const response = await AssessmentTypeService.update(id, typeData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteAssessmentType = createAsyncThunk(
    'assessmentTypes/deleteAssessmentType',
    async (id, { rejectWithValue }) => {
        try {
            await AssessmentTypeService.delete(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getAssessmentTypeById = createAsyncThunk(
    'assessmentTypes/getAssessmentTypeById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await AssessmentTypeService.getById(id);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Создаем слайс
const assessmentTypeSlice = createSlice({
    name: 'assessmentTypes',
    initialState: {
        data: [],
        currentType: null,
        isLoading: false,
        errors: [],
    },
    reducers: {
        clearErrors: (state) => {
            state.errors = [];
        },
        clearCurrentType: (state) => {
            state.currentType = null;
        },
        setCurrentType: (state, action) => {
            state.currentType = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Загрузка всех типов оценивания
            .addCase(fetchAssessmentTypes.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(fetchAssessmentTypes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchAssessmentTypes.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            // Добавление типа оценивания
            .addCase(addAssessmentType.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(addAssessmentType.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data.unshift(action.payload);
            })
            .addCase(addAssessmentType.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            // Обновление типа оценивания
            .addCase(updateAssessmentType.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(updateAssessmentType.fulfilled, (state, action) => {
                state.isLoading = false;
                const updatedType = action.payload;
                state.data = state.data.map(type =>
                    type.id === updatedType.id ? updatedType : type
                );
            })
            .addCase(updateAssessmentType.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            // Удаление типа оценивания
            .addCase(deleteAssessmentType.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(deleteAssessmentType.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = state.data.filter(type => type.id !== action.payload);
            })
            .addCase(deleteAssessmentType.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            // Получение типа оценивания по ID
            .addCase(getAssessmentTypeById.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(getAssessmentTypeById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentType = action.payload;
            })
            .addCase(getAssessmentTypeById.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            });
    },
});

export const { clearErrors, clearCurrentType, setCurrentType } = assessmentTypeSlice.actions;
export default assessmentTypeSlice.reducer;