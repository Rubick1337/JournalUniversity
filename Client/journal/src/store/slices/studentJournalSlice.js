import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Асинхронный экшен для получения данных
export const fetchStudentJournal = createAsyncThunk(
    'studentJournal/fetchStudentJournal',
    async (params = {}, { rejectWithValue }) => {
        try {
            // Пример данных с дополнительными студентами и предметами
            const response = {
                students: [
                    { name: 'Иванов И.И.', absences: [{ subjectId: 1, type: 'уважительная', hours: 1 }, { subjectId: 3, type: 'неуважительная', hours: 2 }] },
                    { name: 'Петров П.П.', absences: [{ subjectId: 2, type: 'неуважительная', hours: 2 }, { subjectId: 3, type: 'уважительная', hours: 1 }] },
                    { name: 'Сидоров С.С.', absences: [{ subjectId: 1, type: 'неуважительная', hours: 2 }] },
                    { name: 'Кузнецова К.К.', absences: [{ subjectId: 1, type: 'уважительная', hours: 1 }, { subjectId: 2, type: 'неуважительная', hours: 2 }] },
                    { name: 'Тимофеев Т.Т.', absences: [{ subjectId: 2, type: 'уважительная', hours: 1 }] }
                ],
                subjects: [
                    { id: 1, name: 'Математика', date: '10.05.2023' },
                    { id: 2, name: 'Физика', date: '10.05.2023' },
                    { id: 3, name: 'Химия', date: '11.05.2023' },
                    { id: 4, name: 'Биология', date: '12.05.2023' },
                    { id: 5, name: 'География', date: '12.05.2023' }
                ],
                groups: ['Группа 1', 'Группа 2', 'Группа 3'],
                subgroups: {
                    'Группа 1': ['Подгруппа 1', 'Подгруппа 2'],
                    'Группа 2': ['Подгруппа 3', 'Подгруппа 4'],
                    'Группа 3': ['Подгруппа 5', 'Подгруппа 6']
                }
            };

            // Преобразуем студентов в объект с ключом по имени для легкости доступа
            const students = response.students.reduce((acc, student) => {
                acc[student.name] = student.absences;
                return acc;
            }, {});

            return {
                students,
                subjects: response.subjects,
                groups: response.groups,
                subgroups: response.subgroups
            };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Создаем слайс
const studentJournalSlice = createSlice({
    name: 'studentJournal',
    initialState: {
        students: {}, // Состояние для студентов (ключ - имя студента, значение - массив пропусков)
        subjects: [],
        groups: [],
        subgroups: {},
        selectedGroup: '',
        selectedSubgroup: '',
        currentPage: 1,
        loading: false,
        error: null
    },
    reducers: {
        setSelectedGroup(state, action) {
            state.selectedGroup = action.payload;
        },
        setSelectedSubgroup(state, action) {
            state.selectedSubgroup = action.payload;
        },
        setCurrentPage(state, action) {
            state.currentPage = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStudentJournal.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudentJournal.fulfilled, (state, action) => {
                state.loading = false;
                state.students = action.payload.students;
                state.subjects = action.payload.subjects;
                state.groups = action.payload.groups;
                state.subgroups = action.payload.subgroups;
            })
            .addCase(fetchStudentJournal.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

// Экспорт редьюсеров
export const { setSelectedGroup, setSelectedSubgroup, setCurrentPage } = studentJournalSlice.actions;

export default studentJournalSlice.reducer;
