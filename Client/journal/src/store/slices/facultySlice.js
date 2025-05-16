import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import FacultyService from '../../services/FacultyService';

// Асинхронные действия
export const getAllFaculties = createAsyncThunk(
    'faculties/getAll',
    async (params, { rejectWithValue }) => {
        try {
            const response = await FacultyService.getAll(params || {});
            return {
                data: response.data,
                meta: response.meta
            };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createFaculty = createAsyncThunk(
    'faculties/create',
    async (facultyData, { rejectWithValue }) => {
        try {
            const response = await FacultyService.create(facultyData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateFaculty = createAsyncThunk(
    'faculties/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await FacultyService.update(id, data);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteFaculty = createAsyncThunk(
    'faculties/delete',
    async (id, { rejectWithValue }) => {
        try {
            await FacultyService.delete(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getFacultyById = createAsyncThunk(
    'faculties/getById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await FacultyService.getById(id);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getFacultyWithDetails = createAsyncThunk(
    'faculties/getWithDetails',
    async (id, { rejectWithValue }) => {
        try {
            const response = await FacultyService.getFacultyWithDetails(id);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Slice
const facultySlice = createSlice({
    name: 'faculties',
    initialState: {
        facultiesList: {
            data: [],
            isLoading: false,
            errors: [],
            meta: {
                total: 0,
                totalPages: 0,
                limit: 10,
                page: 1
            }
        },
        currentFaculty: null,
        searchParams: {
            idQuery: '',
            nameQuery: '',
            fullNameQuery: '',
            deanQuery: ''
        }
    },
    reducers: {
        clearFacultyErrors: (state) => {
            state.facultiesList.errors = [];
        },
        clearCurrentFaculty: (state) => {
            state.currentFaculty = null;
        },
        setFacultyPage: (state, action) => {
            state.facultiesList.meta.page = action.payload;
        },
        setFacultyLimit: (state, action) => {
            state.facultiesList.meta.limit = action.payload;
        },
        setFacultySearchParams: (state, action) => {
            state.searchParams = { ...state.searchParams, ...action.payload };
        }
    },
    extraReducers: (builder) => {
        builder
            // Получение всех факультетов
            .addCase(getAllFaculties.pending, (state) => {
                state.facultiesList.isLoading = true;
                state.facultiesList.errors = [];
            })
            .addCase(getAllFaculties.fulfilled, (state, action) => {
                state.facultiesList.isLoading = false;
                console.log('API response:', action.payload.data[0]?.dean_person); // Логирование
                state.facultiesList.data = action.payload.data;
                state.facultiesList.data = action.payload.data;
                state.facultiesList.meta = {
                    ...state.facultiesList.meta,
                    ...action.payload.meta,
                    totalPages: Math.ceil(action.payload.meta.total / state.facultiesList.meta.limit)
                };
            })
            .addCase(getAllFaculties.rejected, (state, action) => {
                state.facultiesList.isLoading = false;
                state.facultiesList.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            // Создание факультета
            .addCase(createFaculty.pending, (state) => {
                state.facultiesList.isLoading = true;
                state.facultiesList.errors = [];
            })
            .addCase(createFaculty.fulfilled, (state, action) => {
                state.facultiesList.isLoading = false;
                state.facultiesList.data.unshift(action.payload);
                state.facultiesList.meta.total += 1;
                state.facultiesList.meta.totalPages = Math.ceil(
                    state.facultiesList.meta.total / state.facultiesList.meta.limit
                );
            })
            .addCase(createFaculty.rejected, (state, action) => {
                state.facultiesList.isLoading = false;
                state.facultiesList.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            // Обновление факультета
            .addCase(updateFaculty.pending, (state) => {
                state.facultiesList.isLoading = true;
                state.facultiesList.errors = [];
            })
            .addCase(updateFaculty.fulfilled, (state, action) => {
                state.facultiesList.isLoading = false;
                const updatedFaculty = action.payload;
                state.facultiesList.data = state.facultiesList.data.map(faculty =>
                    faculty.id === updatedFaculty.id ? updatedFaculty : faculty
                );
                if (state.currentFaculty?.id === updatedFaculty.id) {
                    state.currentFaculty = updatedFaculty;
                }
            })
            .addCase(updateFaculty.rejected, (state, action) => {
                state.facultiesList.isLoading = false;
                state.facultiesList.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            // Удаление факультета
            .addCase(deleteFaculty.pending, (state) => {
                state.facultiesList.isLoading = true;
                state.facultiesList.errors = [];
            })
            .addCase(deleteFaculty.fulfilled, (state, action) => {
                state.facultiesList.isLoading = false;
                state.facultiesList.data = state.facultiesList.data.filter(
                    faculty => faculty.id !== action.payload
                );
                state.facultiesList.meta.total -= 1;
                state.facultiesList.meta.totalPages = Math.ceil(
                    state.facultiesList.meta.total / state.facultiesList.meta.limit
                );
            })
            .addCase(deleteFaculty.rejected, (state, action) => {
                state.facultiesList.isLoading = false;
                state.facultiesList.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            // Получение факультета по ID
            .addCase(getFacultyById.pending, (state) => {
                state.facultiesList.isLoading = true;
                state.facultiesList.errors = [];
            })
            .addCase(getFacultyById.fulfilled, (state, action) => {
                state.facultiesList.isLoading = false;
                state.currentFaculty = action.payload;
            })
            .addCase(getFacultyById.rejected, (state, action) => {
                state.facultiesList.isLoading = false;
                state.facultiesList.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            // Получение факультета с деталями
            .addCase(getFacultyWithDetails.pending, (state) => {
                state.facultiesList.isLoading = true;
                state.facultiesList.errors = [];
            })
            .addCase(getFacultyWithDetails.fulfilled, (state, action) => {
                state.facultiesList.isLoading = false;
                state.currentFaculty = action.payload;
            })
            .addCase(getFacultyWithDetails.rejected, (state, action) => {
                state.facultiesList.isLoading = false;
                state.facultiesList.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            });
    }
});

export const {
    clearFacultyErrors,
    clearCurrentFaculty,
    setFacultyPage,
    setFacultyLimit,
    setFacultySearchParams

} = facultySlice.actions;

export default facultySlice.reducer;