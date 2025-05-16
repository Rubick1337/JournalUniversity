// subgroupSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import SubgroupService from '../../services/SubgroupService';

// Асинхронные действия
export const fetchSubgroups = createAsyncThunk(
    'subgroups/fetchAll',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await SubgroupService.getAllSubgroups(params);
            return {
                data: response.data,
                meta: response.meta
            };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createSubgroup = createAsyncThunk(
    'subgroups/create',
    async (subgroupData, { rejectWithValue }) => {
        try {
            const response = await SubgroupService.createSubgroup(subgroupData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateSubgroup = createAsyncThunk(
    'subgroups/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await SubgroupService.updateSubgroup(id, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteSubgroup = createAsyncThunk(
    'subgroups/delete',
    async (id, { rejectWithValue }) => {
        try {
            await SubgroupService.deleteSubgroup(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getSubgroupById = createAsyncThunk(
    'subgroups/getById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await SubgroupService.getSubgroupById(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Slice
const subgroupsSlice = createSlice({
    name: 'subgroups',
    initialState: {
        data: [],
        currentSubgroup: null,
        isLoading: false,
        errors: [],
        meta: {
            total: 0,
            totalPages: 0,
            limit: 5,
            page: 1
        },
        searchParams: {
            idQuery: '',
            nameQuery: ''
        }
    },
    reducers: {
        clearErrors: (state) => {
            state.errors = [];
        },
        clearCurrentSubgroup: (state) => {
            state.currentSubgroup = null;
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
            .addCase(fetchSubgroups.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(fetchSubgroups.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload.data;
                state.meta = {
                    ...state.meta,
                    ...action.payload.meta,
                    totalPages: Math.ceil(action.payload.meta.total / state.meta.limit)
                };
            })
            .addCase(fetchSubgroups.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            .addCase(createSubgroup.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(createSubgroup.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data.unshift(action.payload);
                state.meta.total += 1;
                state.meta.totalPages = Math.ceil(state.meta.total / state.meta.limit);
            })
            .addCase(createSubgroup.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            .addCase(updateSubgroup.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(updateSubgroup.fulfilled, (state, action) => {
                state.isLoading = false;
                const updated = action.payload;
                state.data = state.data.map(subgroup =>
                    subgroup.id === updated.id ? updated : subgroup
                );
                if (state.currentSubgroup?.id === updated.id) {
                    state.currentSubgroup = updated;
                }
            })
            .addCase(updateSubgroup.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            .addCase(deleteSubgroup.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(deleteSubgroup.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = state.data.filter(subgroup => subgroup.id !== action.payload);
                state.meta.total -= 1;
                state.meta.totalPages = Math.ceil(state.meta.total / state.meta.limit);
            })
            .addCase(deleteSubgroup.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            .addCase(getSubgroupById.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(getSubgroupById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentSubgroup = action.payload;
            })
            .addCase(getSubgroupById.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            });
    }
});

export const {
    clearErrors,
    clearCurrentSubgroup,
    setPage,
    setLimit,
    setSearchParams
} = subgroupsSlice.actions;

export default subgroupsSlice.reducer;