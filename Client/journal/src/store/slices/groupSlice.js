// groupSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import GroupService from '../../services/GroupService';

// Async Thunks
export const fetchGroups = createAsyncThunk(
    'groups/fetchAll',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await GroupService.getAllGroups({
                limit: params.limit,
                page: params.page,
                sortBy: params.sortBy,
                sortOrder: params.sortOrder,
                nameQuery: params.nameQuery,
                facultyQuery: params.facultyQuery,
                departmentQuery: params.departmentQuery,
                specialtyQuery: params.specialtyQuery
            });
            return {
                data: response.data,
                meta: response.meta
            };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createGroup = createAsyncThunk(
    'groups/create',
    async (groupData, { rejectWithValue }) => {
        try {
            const response = await GroupService.createGroup(groupData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateGroup = createAsyncThunk(
    'groups/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await GroupService.updateGroup(id, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteGroup = createAsyncThunk(
    'groups/delete',
    async (id, { rejectWithValue }) => {
        try {
            await GroupService.deleteGroup(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getGroupById = createAsyncThunk(
    'groups/getById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await GroupService.getGroupById(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getCurrentSubjects = createAsyncThunk(
    'groups/getCurrentSubjects',
    async (groupId, { rejectWithValue }) => {
        try {
            const response = await GroupService.getCurrentSubjects(groupId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Slice
const groupSlice = createSlice({
    name: 'groups',
    initialState: {
        data: [],
        currentGroup: null,
        currentSubjects: [],
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
            facultyQuery: '',
            departmentQuery: '',
            specialtyQuery: '',
            classRepresentativeQuery: '',
            teacherCuratorQuery: ''
        }
    },
    reducers: {
        clearErrors: (state) => {
            state.errors = [];
        },
        clearCurrentGroup: (state) => {
            state.currentGroup = null;
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
            // Fetch Groups
            .addCase(fetchGroups.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(fetchGroups.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload.data;
                state.meta = {
                    ...state.meta,
                    ...action.payload.meta,
                    totalPages: Math.ceil(action.payload.meta.total / state.meta.limit)
                };
            })
            .addCase(fetchGroups.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            // Create Group
            .addCase(createGroup.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(createGroup.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data.unshift(action.payload);
                state.meta.total += 1;
                state.meta.totalPages = Math.ceil(state.meta.total / state.meta.limit);
            })
            .addCase(createGroup.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            // Update Group
            .addCase(updateGroup.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(updateGroup.fulfilled, (state, action) => {
                state.isLoading = false;
                const updated = action.payload;
                state.data = state.data.map(group =>
                    group.id === updated.id ? updated : group
                );
                if (state.currentGroup?.id === updated.id) {
                    state.currentGroup = updated;
                }
            })
            .addCase(updateGroup.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            // Delete Group
            .addCase(deleteGroup.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(deleteGroup.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = state.data.filter(group => group.id !== action.payload);
                state.meta.total -= 1;
                state.meta.totalPages = Math.ceil(state.meta.total / state.meta.limit);
            })
            .addCase(deleteGroup.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            // Get Group By ID
            .addCase(getGroupById.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(getGroupById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentGroup = action.payload;
            })
            .addCase(getGroupById.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            // Get Current Subjects
            .addCase(getCurrentSubjects.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(getCurrentSubjects.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentSubjects = action.payload;
            })
            .addCase(getCurrentSubjects.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            });
    }
});

export const {
    clearErrors,
    clearCurrentGroup,
    setPage,
    setLimit,
    setSearchParams
} = groupSlice.actions;

export default groupSlice.reducer;