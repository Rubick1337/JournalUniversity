import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import CurriculumService from '../../services/CurriculumService';

// Асинхронные действия
export const fetchCurriculums = createAsyncThunk(
    'curriculums/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            const response = await CurriculumService.getAlls(params);
            return {
                data: response.data,
                meta: response.meta
            };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createCurriculum = createAsyncThunk(
    'curriculums/create',
    async (curriculumData, { rejectWithValue }) => {
        try {
            const response = await CurriculumService.create(curriculumData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateCurriculum = createAsyncThunk(
    'curriculums/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await CurriculumService.update(id, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteCurriculum = createAsyncThunk(
    'curriculums/delete',
    async (id, { rejectWithValue }) => {
        try {
            await CurriculumService.delete(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getCurriculumById = createAsyncThunk(
    'curriculums/getById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await CurriculumService.getById(id);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Slice
const curriculumSlice = createSlice({
    name: 'curriculums',
    initialState: {
        data: [],
        currentCurriculum: null,
        isLoading: false,
        errors: [],
        meta: {
            total: 0,
            totalPages: 0,
            limit: 10,
            page: 1
        },
        searchParams: {
            idQuery: '',
            yearQuery: '',
            specialtyQuery: '',
            educationFormQuery: ''
        }
    },
    reducers: {
        clearErrors: (state) => {
            state.errors = [];
        },
        clearCurrentCurriculum: (state) => {
            state.currentCurriculum = null;
        },
        setPage: (state, action) => {
            state.meta.page = action.payload;
        },
        setLimit: (state, action) => {
            state.meta.limit = action.payload;
        },
        setSearchParams: (state, action) => {
            state.searchParams = { ...state.searchParams, ...action.payload };
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCurriculums.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(fetchCurriculums.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload.data;
                state.meta = {
                    ...state.meta,
                    ...action.payload.meta,
                    totalPages: Math.ceil(action.payload.meta.total / state.meta.limit)
                };
            })
            .addCase(fetchCurriculums.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            .addCase(createCurriculum.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(createCurriculum.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data.unshift(action.payload);
                state.meta.total += 1;
                state.meta.totalPages = Math.ceil(state.meta.total / state.meta.limit);
            })
            .addCase(createCurriculum.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            .addCase(updateCurriculum.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(updateCurriculum.fulfilled, (state, action) => {
                state.isLoading = false;
                const updated = action.payload;
                state.data = state.data.map(curriculum =>
                    curriculum.id === updated.id ? updated : curriculum
                );
                if (state.currentCurriculum?.id === updated.id) {
                    state.currentCurriculum = updated;
                }
            })
            .addCase(updateCurriculum.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            .addCase(deleteCurriculum.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(deleteCurriculum.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = state.data.filter(curriculum => curriculum.id !== action.payload);
                state.meta.total -= 1;
                state.meta.totalPages = Math.ceil(state.meta.total / state.meta.limit);
            })
            .addCase(deleteCurriculum.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            .addCase(getCurriculumById.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(getCurriculumById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentCurriculum = action.payload;
            })
            .addCase(getCurriculumById.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            });
    }
});

export const {
    clearErrors,
    clearCurrentCurriculum,
    setPage,
    setLimit,
    setSearchParams
} = curriculumSlice.actions;

export default curriculumSlice.reducer;