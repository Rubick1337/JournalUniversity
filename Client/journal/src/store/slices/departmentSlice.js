import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import DepartmentService from '../../services/DepartmentService';

// Асинхронные действия
export const fetchDepartments = createAsyncThunk(
    'departments/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            const response = await DepartmentService.getAll(params);
            console.log('Departments API response:', response); // Добавьте это
            return {
                data: response.data,
                meta: response.meta
            };
        } catch (error) {
            console.error('Departments API error:', error); // И это
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createDepartment = createAsyncThunk(
    'departments/create',
    async (departmentData, { rejectWithValue }) => {
        try {

            const response = await DepartmentService.create(departmentData);
            console.log("saqweqweq" + departmentData.faculty_id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateDepartment = createAsyncThunk(
    'departments/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await DepartmentService.update(id, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteDepartment = createAsyncThunk(
    'departments/delete',
    async (id, { rejectWithValue }) => {
        try {
            await DepartmentService.delete(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getDepartmentById = createAsyncThunk(
    'departments/getById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await DepartmentService.getById(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Slice
const departmentSlice = createSlice({
    name: 'departments',
    initialState: {
        data: [],
        currentDepartment: null,
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
            fullNameQuery: '',
            facultyQuery: '',
            headQuery: ''
        }
    },
    reducers: {
        clearErrors: (state) => {
            state.errors = [];
        },
        clearCurrentDepartment: (state) => {
            state.currentDepartment = null;
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
            .addCase(fetchDepartments.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(fetchDepartments.fulfilled, (state, action) => {
                console.log('Received departments:', action.payload);
                state.isLoading = false;
                state.data = action.payload.data;
                state.meta = {
                    ...state.meta,
                    ...action.payload.meta,
                    totalPages: Math.ceil(action.payload.meta.total / state.meta.limit)
                };
            })
            .addCase(fetchDepartments.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            .addCase(createDepartment.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(createDepartment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data.unshift(action.payload);
                state.meta.total += 1;
                state.meta.totalPages = Math.ceil(state.meta.total / state.meta.limit);
            })
            .addCase(createDepartment.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            .addCase(updateDepartment.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(updateDepartment.fulfilled, (state, action) => {
                state.isLoading = false;
                const updated = action.payload;
                state.data = state.data.map(department =>
                    department.id === updated.id ? updated : department
                );
                if (state.currentDepartment?.id === updated.id) {
                    state.currentDepartment = updated;
                }
            })
            .addCase(updateDepartment.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            .addCase(deleteDepartment.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(deleteDepartment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = state.data.filter(department => department.id !== action.payload);
                state.meta.total -= 1;
                state.meta.totalPages = Math.ceil(state.meta.total / state.meta.limit);
            })
            .addCase(deleteDepartment.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            .addCase(getDepartmentById.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(getDepartmentById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentDepartment = action.payload;
            })
            .addCase(getDepartmentById.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            });
    }
});

export const {
    clearErrors,
    clearCurrentDepartment,
    setPage,
    setLimit,
    setSearchParams
} = departmentSlice.actions;

export default departmentSlice.reducer;