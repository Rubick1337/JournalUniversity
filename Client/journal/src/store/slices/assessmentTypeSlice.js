import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AssessmentTypeService from '../../services/AssessmentTypeService';

// Асинхронные действия
export const fetchAssessmentTypes = createAsyncThunk(
    'assessmentTypes/fetchAssessmentTypes',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await AssessmentTypeService.getAlls(params);
            return {
                data: response.data,
                meta: response.meta
            };
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

// Slice
const assessmentTypeSlice = createSlice({
    name: 'assessmentTypes',
    initialState: {
        data: [],
        currentType: null,
        isLoading: false,
        errors: [],
        meta: {
            total: 0,
            totalPage: 0,
            limit: 10,
            page: 1
        },
        searchParams: {}
    },
    reducers: {
        clearErrors: (state) => {
            state.errors = [];
        },
        clearCurrentType: (state) => {
            state.currentType = null;
        },
        setPage: (state, action) => {
            state.meta.page = action.payload;
        },
        setLimit: (state, action) => {
            state.meta.limit = action.payload;
        },
        setSearchParams: (state, action) => { // Добавляем новый редюсер
            state.searchParams = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAssessmentTypes.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(fetchAssessmentTypes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload.data;
                state.meta = action.payload.meta;
            })
            .addCase(fetchAssessmentTypes.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            .addCase(addAssessmentType.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(addAssessmentType.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data.unshift(action.payload);
                state.meta.total += 1;
                state.meta.totalPage = Math.ceil(state.meta.total / state.meta.limit);
            })
            .addCase(addAssessmentType.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            .addCase(updateAssessmentType.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(updateAssessmentType.fulfilled, (state, action) => {
                state.isLoading = false;
                const updated = action.payload;
                state.data = state.data.map(type =>
                    type.id === updated.id ? updated : type
                );
            })
            .addCase(updateAssessmentType.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            .addCase(deleteAssessmentType.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(deleteAssessmentType.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = state.data.filter(type => type.id !== action.payload);
                state.meta.total -= 1;
                state.meta.totalPage = Math.ceil(state.meta.total / state.meta.limit);
            })
            .addCase(deleteAssessmentType.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

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
    }
});

export const {
    clearErrors,
    clearCurrentType,
    setPage,
    setLimit,
    setSearchParams
} = assessmentTypeSlice.actions;

export default assessmentTypeSlice.reducer;
