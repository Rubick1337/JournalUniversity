import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import EstimationTypeService from '../../services/estimationTypesService';

// Асинхронные действия
export const fetchEstimationTypes = createAsyncThunk(
    'estimationTypes/fetchEstimationTypes',
    async (params, { rejectWithValue }) => {
        try {
            const response = await EstimationTypeService.getAlls(params);
            return {
                data: response.data,
                meta: response.meta
            };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addEstimationType = createAsyncThunk(
    'estimationTypes/addEstimationType',
    async (typeData, { rejectWithValue }) => {
        try {
            const response = await EstimationTypeService.create(typeData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateEstimationType = createAsyncThunk(
    'estimationTypes/updateEstimationType',
    async ({ id, typeData }, { rejectWithValue }) => {
        try {
            const response = await EstimationTypeService.update(id, typeData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteEstimationType = createAsyncThunk(
    'estimationTypes/deleteEstimationType',
    async (id, { rejectWithValue }) => {
        try {
            await EstimationTypeService.delete(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getEstimationTypeById = createAsyncThunk(
    'estimationTypes/getEstimationTypeById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await EstimationTypeService.getById(id);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Slice
const estimationTypeSlice = createSlice({
    name: 'estimationTypes',
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
        setSearchParams: (state, action) => {
            state.searchParams = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEstimationTypes.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(fetchEstimationTypes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload.data;
                state.meta = action.payload.meta;
            })
            .addCase(fetchEstimationTypes.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            .addCase(addEstimationType.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(addEstimationType.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data.unshift(action.payload);
                state.meta.total += 1;
                state.meta.totalPage = Math.ceil(state.meta.total / state.meta.limit);
            })
            .addCase(addEstimationType.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            .addCase(updateEstimationType.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(updateEstimationType.fulfilled, (state, action) => {
                state.isLoading = false;
                const updated = action.payload;
                state.data = state.data.map(type =>
                    type.id === updated.id ? updated : type
                );
            })
            .addCase(updateEstimationType.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            .addCase(deleteEstimationType.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(deleteEstimationType.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = state.data.filter(type => type.id !== action.payload);
                state.meta.total -= 1;
                state.meta.totalPage = Math.ceil(state.meta.total / state.meta.limit);
            })
            .addCase(deleteEstimationType.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            .addCase(getEstimationTypeById.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(getEstimationTypeById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentType = action.payload;
            })
            .addCase(getEstimationTypeById.rejected, (state, action) => {
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
} = estimationTypeSlice.actions;

export default estimationTypeSlice.reducer;