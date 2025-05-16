import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import TopicService from '../../services/TopicService';

// Асинхронные действия
export const fetchTopics = createAsyncThunk(
    'topics/fetchAll',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await TopicService.getAllTopics(params);
            return {
                data: response.data,
                meta: response.meta
            };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createTopic = createAsyncThunk(
    'topics/create',
    async (topicData, { rejectWithValue }) => {
        try {
            const response = await TopicService.createTopic(topicData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateTopic = createAsyncThunk(
    'topics/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await TopicService.updateTopic(id, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteTopic = createAsyncThunk(
    'topics/delete',
    async (id, { rejectWithValue }) => {
        try {
            await TopicService.deleteTopic(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getTopicById = createAsyncThunk(
    'topics/getById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await TopicService.getTopicById(id);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Slice
const topicSlice = createSlice({
    name: 'topics',
    initialState: {
        data: [],
        currentTopic: null,
        isLoading: false,
        errors: [],
        meta: {
            total: 0,
            totalPages: 0,
            limit: 10,
            page: 1
        },
        searchParams: {
            nameQuery: '',
            idQuery: '',
            subjectQuery: '',
            sortBy: 'name',
            sortOrder: 'ASC'
        }
    },
    reducers: {
        clearErrors: (state) => {
            state.errors = [];
        },
        clearCurrentTopic: (state) => {
            state.currentTopic = null;
        },
        setPage: (state, action) => {
            state.meta.page = action.payload;
        },
        setLimit: (state, action) => {
            state.meta.limit = action.payload;
        },
        setSort: (state, action) => {
            state.searchParams.sortBy = action.payload.sortBy;
            state.searchParams.sortOrder = action.payload.sortOrder;
        },
        setSearchParams: (state, action) => {
            state.searchParams = { ...state.searchParams, ...action.payload };
        },
        resetSearchParams: (state) => {
            state.searchParams = {
                nameQuery: '',
                idQuery: '',
                subjectQuery: '',
                sortBy: 'name',
                sortOrder: 'ASC'
            };
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Topics
            .addCase(fetchTopics.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(fetchTopics.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload.data;
                state.meta = {
                    ...state.meta,
                    total: action.payload.meta.total,
                    totalPages: action.payload.meta.totalPage,
                    limit: action.payload.meta.limit,
                    page: action.payload.meta.page
                };
            })

            .addCase(fetchTopics.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            // Create Topic
            .addCase(createTopic.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(createTopic.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data.unshift(action.payload);
                state.meta.totalItems += 1;
                state.meta.totalPages = Math.ceil(state.meta.totalItems / state.meta.limit);
            })
            .addCase(createTopic.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            // Update Topic
            .addCase(updateTopic.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(updateTopic.fulfilled, (state, action) => {
                state.isLoading = false;
                const updated = action.payload;
                state.data = state.data.map(topic =>
                    topic.id === updated.id ? updated : topic
                );
                if (state.currentTopic?.id === updated.id) {
                    state.currentTopic = updated;
                }
            })
            .addCase(updateTopic.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            // Delete Topic
            .addCase(deleteTopic.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(deleteTopic.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = state.data.filter(topic => topic.id !== action.payload);
                state.meta.totalItems -= 1;
                state.meta.totalPages = Math.ceil(state.meta.totalItems / state.meta.limit);
            })
            .addCase(deleteTopic.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            // Get Topic By Id
            .addCase(getTopicById.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(getTopicById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentTopic = action.payload;
            })
            .addCase(getTopicById.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            });
    }
});

export const {
    clearErrors,
    clearCurrentTopic,
    setPage,
    setLimit,
    setSort,
    setSearchParams,
    resetSearchParams
} = topicSlice.actions;

export default topicSlice.reducer;