import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import CurriculumSubjectService from '../../services/CurriculumSubjectService';

// Создаем слайс
const curriculumSubjectSlice = createSlice({
    name: 'curriculumSubject',
    initialState: {
        data: [],
        currentType: null,
        isLoading: false,
        errors: [],
    },
    reducers: {
        clearErrors: (state) => {
            state.errors = [];
        },
        clearCurrentType: (state) => {
            state.currentType = null;
        },
        setCurrentType: (state, action) => {
            state.currentType = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Загрузка всех типов оценивания
            .addCase(fetchAssessmentTypes.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(fetchAssessmentTypes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchAssessmentTypes.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            // Добавление типа оценивания
            .addCase(addAssessmentType.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(addAssessmentType.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data.unshift(action.payload);
            })
            .addCase(addAssessmentType.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            // Обновление типа оценивания
            .addCase(updateAssessmentType.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(updateAssessmentType.fulfilled, (state, action) => {
                state.isLoading = false;
                const updatedType = action.payload;
                state.data = state.data.map(type =>
                    type.id === updatedType.id ? updatedType : type
                );
            })
            .addCase(updateAssessmentType.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            // Удаление типа оценивания
            .addCase(deleteAssessmentType.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(deleteAssessmentType.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = state.data.filter(type => type.id !== action.payload);
            })
            .addCase(deleteAssessmentType.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            })

            // Получение типа оценивания по ID
            .addCase(getAssessmentTypeById.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(getAssessmentTypeById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentType = action.payload;
            })
            .addCase(getAssessmentTypeById.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = Array.isArray(action.payload)
                    ? action.payload
                    : [{ message: action.payload }];
            });
    },
});

export const { clearErrors, clearCurrentType, setCurrentType } = assessmentTypeSlice.actions;
export default assessmentTypeSlice.reducer;