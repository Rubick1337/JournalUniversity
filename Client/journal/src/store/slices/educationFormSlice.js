import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import EducationFormService from '../../services/EducationFormService';

// Асинхронные действия
export const fetchEducationForms = createAsyncThunk(
    'educationForms/fetchEducationForms',
    async (_, { rejectWithValue }) => {
        try {
            const response = await EducationFormService.getAlls();
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addEducationForm = createAsyncThunk(
    'educationForms/addEducationForm',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await EducationFormService.create(formData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateEducationForm = createAsyncThunk(
    'educationForms/updateEducationForm',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await EducationFormService.update(id, formData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteEducationForm = createAsyncThunk(
    'educationForms/deleteEducationForm',
    async (id, { rejectWithValue }) => {
        try {
            await EducationFormService.delete(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getEducationFormById = createAsyncThunk(
    'educationForms/getEducationFormById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await EducationFormService.getById(id);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Создаем слайс
const educationFormSlice = createSlice({
    name: 'educationForms',
    initialState: {
        data: [],
        currentForm: null,
        isLoading: false,
        errors: [],
    },
    reducers: {
        clearErrors: (state) => {
            state.errors = [];
        },
        clearCurrentForm: (state) => {
            state.currentForm = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Загрузка всех форм обучения
            .addCase(fetchEducationForms.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(fetchEducationForms.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchEducationForms.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            // Добавление формы обучения
            .addCase(addEducationForm.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(addEducationForm.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data.unshift(action.payload);
            })
            .addCase(addEducationForm.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            // Обновление формы обучения
            .addCase(updateEducationForm.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(updateEducationForm.fulfilled, (state, action) => {
                state.isLoading = false;
                const updatedForm = action.payload;
                state.data = state.data.map(form =>
                    form.id === updatedForm.id ? updatedForm : form
                );
            })
            .addCase(updateEducationForm.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            // Удаление формы обучения
            .addCase(deleteEducationForm.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(deleteEducationForm.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = state.data.filter(form => form.id !== action.payload);
            })
            .addCase(deleteEducationForm.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            // Получение формы обучения по ID
            .addCase(getEducationFormById.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(getEducationFormById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentForm = action.payload;
            })
            .addCase(getEducationFormById.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            });
    },
});

export const { clearErrors, clearCurrentForm } = educationFormSlice.actions;
export default educationFormSlice.reducer;