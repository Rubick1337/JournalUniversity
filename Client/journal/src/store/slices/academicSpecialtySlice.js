import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AcademicSpecialtyService from '../../services/AcademicSpecialtyService';

// Асинхронные действия
export const fetchAcademicSpecialties = createAsyncThunk(
    'academicSpecialties/fetchAcademicSpecialties',
    async (params, { rejectWithValue }) => {
        try {
            const response = await AcademicSpecialtyService.getAlls(params);
            return {
                data: response.data,
                meta: response.meta
            };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addAcademicSpecialty = createAsyncThunk(
    'academicSpecialties/addAcademicSpecialty',
    async (specialtyData, { rejectWithValue }) => {
        try {
            const response = await AcademicSpecialtyService.create(specialtyData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateAcademicSpecialty = createAsyncThunk(
    'academicSpecialties/updateAcademicSpecialty',
    async ({ code, specialtyData }, { rejectWithValue }) => {
        try {
            const response = await AcademicSpecialtyService.update(code, specialtyData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteAcademicSpecialty = createAsyncThunk(
    'academicSpecialties/deleteAcademicSpecialty',
    async (code, { rejectWithValue }) => {
        try {
            await AcademicSpecialtyService.delete(code);
            return code;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getAcademicSpecialtyByCode = createAsyncThunk(
    'academicSpecialties/getAcademicSpecialtyByCode',
    async (code, { rejectWithValue }) => {
        try {
            const response = await AcademicSpecialtyService.getByCode(code);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Slice
const academicSpecialtySlice = createSlice({
    name: 'academicSpecialties',
    initialState: {
        data: [],
        currentSpecialty: null,
        isLoading: false,
        errors: [],
        meta: {
            total: 0,
            totalPage: 0,
            limit: 10,
            page: 1
        }
    },
    reducers: {
        clearErrors: (state) => {
            state.errors = [];
        },
        clearCurrentSpecialty: (state) => {
            state.currentSpecialty = null;
        },
        setPage: (state, action) => {
            state.meta.page = action.payload;
        },
        setLimit: (state, action) => {
            state.meta.limit = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAcademicSpecialties.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(fetchAcademicSpecialties.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload.data;
                state.meta = action.payload.meta;
            })
            .addCase(fetchAcademicSpecialties.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            .addCase(addAcademicSpecialty.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(addAcademicSpecialty.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data.unshift(action.payload);
                state.meta.total += 1;
                state.meta.totalPage = Math.ceil(state.meta.total / state.meta.limit);
            })
            .addCase(addAcademicSpecialty.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            .addCase(updateAcademicSpecialty.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(updateAcademicSpecialty.fulfilled, (state, action) => {
                state.isLoading = false;
                const updated = action.payload;
                state.data = state.data.map(specialty =>
                    specialty.code === updated.code ? updated : specialty
                );
            })
            .addCase(updateAcademicSpecialty.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            .addCase(deleteAcademicSpecialty.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(deleteAcademicSpecialty.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = state.data.filter(specialty => specialty.code !== action.payload);
                state.meta.total -= 1;
                state.meta.totalPage = Math.ceil(state.meta.total / state.meta.limit);
            })
            .addCase(deleteAcademicSpecialty.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            .addCase(getAcademicSpecialtyByCode.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(getAcademicSpecialtyByCode.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentSpecialty = action.payload;
            })
            .addCase(getAcademicSpecialtyByCode.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            });
    }
});

export const {
    clearErrors,
    clearCurrentSpecialty,
    setPage,
    setLimit
} = academicSpecialtySlice.actions;

export default academicSpecialtySlice.reducer;