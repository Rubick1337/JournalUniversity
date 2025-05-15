// studyPlanSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import StudyPlanService from '../../services/StudyPlanService';

// Async Thunks
export const fetchTopicsProgress = createAsyncThunk(
    'studyPlan/fetchTopicsProgress',
    async ({ studentId, subjectId }, { rejectWithValue }) => {
        try {
            const response = await StudyPlanService.getTopicsProgressForSubject(studentId, subjectId);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchLabsStats = createAsyncThunk(
    'studyPlan/fetchLabsStats',
    async ({ studentId, subjectId }, { rejectWithValue }) => {
        try {
            const response = await StudyPlanService.getLabsStatsForStudent(studentId, subjectId);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Slice
const studyPlanSlice = createSlice({
    name: 'studyPlan',
    initialState: {
        topics: [],
        labsStats: null,
        loading: false,
        error: null,
        searchTerm: '',
        currentPage: 1,
        itemsPerPage: 6,
        selectedSubjectId: 11, // начальное значение, можно изменить
    },
    reducers: {
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
            state.currentPage = 1; // Сброс страницы при новом поиске
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
        setItemsPerPage: (state, action) => {
            state.itemsPerPage = action.payload;
        },
        setSelectedSubjectId: (state, action) => {
            state.selectedSubjectId = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Topics Progress
            .addCase(fetchTopicsProgress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTopicsProgress.fulfilled, (state, action) => {
                state.loading = false;
                state.topics = action.payload;
            })
            .addCase(fetchTopicsProgress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch Labs Stats
            .addCase(fetchLabsStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLabsStats.fulfilled, (state, action) => {
                state.loading = false;
                state.labsStats = action.payload;
            })
            .addCase(fetchLabsStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Selectors
export const selectTopics = (state) => state.studyPlan.topics;
export const selectLabsStats = (state) => state.studyPlan.labsStats;
export const selectLoading = (state) => state.studyPlan.loading;
export const selectError = (state) => state.studyPlan.error;
export const selectSearchTerm = (state) => state.studyPlan.searchTerm;
export const selectCurrentPage = (state) => state.studyPlan.currentPage;
export const selectItemsPerPage = (state) => state.studyPlan.itemsPerPage;
export const selectSelectedSubjectId = (state) => state.studyPlan.selectedSubjectId;

export const selectFilteredTopics = (state) => {
    const topics = selectTopics(state) || []; // Fallback to empty array if undefined
    const searchTerm = selectSearchTerm(state).toLowerCase();

    return topics.filter(topic =>
        topic?.topic?.name?.toLowerCase().includes(searchTerm) ||
        topic?.subjectType?.name?.toLowerCase().includes(searchTerm)
    );
};

export const selectPaginatedTopics = (state) => {
    const filteredTopics = selectFilteredTopics(state);
    const currentPage = selectCurrentPage(state);
    const itemsPerPage = selectItemsPerPage(state);

    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTopics.slice(startIndex, startIndex + itemsPerPage);
};

export const selectPageCount = (state) => {
    const filteredTopics = selectFilteredTopics(state);
    const itemsPerPage = selectItemsPerPage(state);
    return Math.ceil(filteredTopics.length / itemsPerPage);
};

// Actions
export const {
    setSearchTerm,
    setCurrentPage,
    setItemsPerPage,
    setSelectedSubjectId,
    clearError
} = studyPlanSlice.actions;

export default studyPlanSlice.reducer;