import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk with mock data
export const fetchStudentLabs = createAsyncThunk(
    'studentLabs/fetchStudentLabs',
    async (_, { rejectWithValue }) => {
        try {
            // Mock data matching your component's structure
            const mockData = {
                discipline: 'Web Development',
                group: 'CS-101',
                student: 'John Doe',
                labs: [
                    { topic: 'Лаба 1', grade: null },
                    { topic: 'Лаба 2', grade: 'отлично' },
                    { topic: 'Лаба 3', grade: 'зачет' },
                    { topic: 'Лаба 4', grade: 'хорошо' },
                    { topic: 'Лаба 5', grade: null },
                    { topic: 'Лаба 6', grade: 'удовлетворительно' },
                    { topic: 'Лаба 7', grade: 'зачет' },
                    { topic: 'Лаба 8', grade: 'отлично' },
                ]
            };

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 300));

            return mockData;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Create the slice
const studentLabsSlice = createSlice({
    name: 'studentLabs',
    initialState: {
        data: {
            discipline: '',
            group: '',
            student: '',
            labs: []
        },
        searchTerm: '', // Поиск по названию темы
        currentPage: 1,
        itemsPerPage: 6,
        loading: false,
        error: null,
        currentStudent: null,
        errors: [],
        meta: {
            total: 0,
            totalPages: 0,
            limit: 5,
            page: 1
        }
    },
    reducers: {
        // Устанавливаем поисковый термин для фильтрации по теме
        setSearchTerm(state, action) {
            state.searchTerm = action.payload;
            state.currentPage = 1; // Сбрасываем на первую страницу при новом поиске
        },
        setCurrentPage(state, action) {
            state.currentPage = action.payload;
        },
        setItemsPerPage(state, action) {
            state.itemsPerPage = action.payload;
            state.currentPage = 1;
        },
        clearErrors(state) {
            state.errors = [];
        },
        clearCurrentStudent(state) {
            state.currentStudent = null;
        },
        setPage(state, action) {
            state.meta.page = action.payload;
        },
        setLimit(state, action) {
            state.meta.limit = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStudentLabs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudentLabs.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                // Обновляем метаданные при успешной загрузке
                state.meta.total = action.payload.labs.length;
                state.meta.totalPages = Math.ceil(action.payload.labs.length / state.itemsPerPage);
            })
            .addCase(fetchStudentLabs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

// Export actions
export const {
    setSearchTerm,
    setCurrentPage,
    setItemsPerPage,
    clearErrors,
    clearCurrentStudent,
    setPage,
    setLimit
} = studentLabsSlice.actions;

// Selectors
export const selectStudentData = (state) => state.studentLabs.data;

// Фильтрация лабораторных работ по теме
export const selectFilteredLabs = (state) => {
    const { data: { labs }, searchTerm } = state.studentLabs;

    if (!searchTerm) return labs;

    return labs.filter(lab =>
        lab.topic.toLowerCase().includes(searchTerm.toLowerCase())
    );
};

// Пагинация лабораторных работ
export const selectPaginatedLabs = (state) => {
    const { currentPage, itemsPerPage } = state.studentLabs;
    const filteredLabs = selectFilteredLabs(state);

    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLabs.slice(startIndex, startIndex + itemsPerPage);
};

// Количество страниц
export const selectPageCount = (state) => {
    const { itemsPerPage } = state.studentLabs;
    const filteredLabs = selectFilteredLabs(state);

    return Math.ceil(filteredLabs.length / itemsPerPage);
};

// Дополнительные селекторы
export const selectCurrentStudent = (state) => state.studentLabs.currentStudent;
export const selectStudentsMeta = (state) => state.studentLabs.meta;
export const selectStudentsErrors = (state) => state.studentLabs.errors;

export default studentLabsSlice.reducer;