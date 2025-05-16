import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import EducationFormService from '../../services/EducationFormService';

// Асинхронные действия
export const fetchEducationForms = createAsyncThunk(
    'educationForms/fetchEducationForms',
    async (params, { rejectWithValue }) => {
        try {
            const response = await EducationFormService.getAlls(params);
            return {
                data: response.data,
                meta: response.meta // Используем meta из ответа сервера
            };
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
        meta: {
            total: 0,
            totalPage: 0,
            limit: 10,
            page: 1
        },
        searchParams: {}
    },
    reducers: {
        clearErrors: (state) => {
            state.errors = [];
        },
        clearCurrentForm: (state) => {
            state.currentForm = null;
        },
        setPage: (state, action) => {
            state.meta.page = action.payload;
        },
        setLimit: (state, action) => {
            state.meta.limit = action.payload;
        },
        setSearchParams: (state, action) => { // Добавляем новый редюсер
            state.searchParams = action.payload;
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
                state.data = action.payload.data;
                state.meta = action.payload.meta; // Сохраняем метаданные
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
                state.meta.total += 1;
                state.meta.totalPage = Math.ceil(state.meta.total / state.meta.limit);
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
                state.meta.total -= 1;
                state.meta.totalPage = Math.ceil(state.meta.total / state.meta.limit);
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

export const { 
    clearErrors, 
    clearCurrentForm,
    setPage,
    setLimit,
    setSearchParams
} = educationFormSlice.actions;

export default educationFormSlice.reducer;