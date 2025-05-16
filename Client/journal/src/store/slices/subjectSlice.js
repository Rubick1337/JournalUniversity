import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import SubjectService from '../../services/SubjectService';

// Асинхронные действия
export const fetchSubjects = createAsyncThunk(
    'subjects/fetchAll',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await SubjectService.getAll(params);
            return {
                data: response.data,
                meta: response.meta
            };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createSubject = createAsyncThunk(
    'subjects/create',
    async (subjectData, { rejectWithValue }) => {
        try {
            const response = await SubjectService.create(subjectData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateSubject = createAsyncThunk(
    'subjects/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await SubjectService.update(id, data);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteSubject = createAsyncThunk(
    'subjects/delete',
    async (id, { rejectWithValue }) => {
        try {
            await SubjectService.delete(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getSubjectById = createAsyncThunk(
    'subjects/getById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await SubjectService.getById(id);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Slice
const subjectSlice = createSlice({
    name: 'subjects',
    initialState: {
        data: [],
        currentSubject: null,
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
            nameQuery: '',
            departmentQuery: ''
        }
    },
    reducers: {
        clearErrors: (state) => {
            state.errors = [];
        },
        clearCurrentSubject: (state) => {
            state.currentSubject = null;
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
            .addCase(fetchSubjects.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(fetchSubjects.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload.data;
                state.meta = {
                    ...state.meta,
                    ...action.payload.meta,
                    totalPages: Math.ceil(action.payload.meta.total / state.meta.limit)
                };
            })
            .addCase(fetchSubjects.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            .addCase(createSubject.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(createSubject.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data.unshift(action.payload);
                state.meta.total += 1;
                state.meta.totalPages = Math.ceil(state.meta.total / state.meta.limit);
            })
            .addCase(createSubject.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            .addCase(updateSubject.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(updateSubject.fulfilled, (state, action) => {
                state.isLoading = false;
                const updated = action.payload;
                state.data = state.data.map(subject =>
                    subject.id === updated.id ? updated : subject
                );
                if (state.currentSubject?.id === updated.id) {
                    state.currentSubject = updated;
                }
            })
            .addCase(updateSubject.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            .addCase(deleteSubject.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(deleteSubject.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = state.data.filter(subject => subject.id !== action.payload);
                state.meta.total -= 1;
                state.meta.totalPages = Math.ceil(state.meta.total / state.meta.limit);
            })
            .addCase(deleteSubject.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            .addCase(getSubjectById.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(getSubjectById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentSubject = action.payload;
            })
            .addCase(getSubjectById.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            });
    }
});

export const {
    clearErrors,
    clearCurrentSubject,
    setPage,
    setLimit,
    setSearchParams
} = subjectSlice.actions;

export default subjectSlice.reducer;