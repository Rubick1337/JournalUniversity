import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import FacultyService from "../../services/FacultyService";
import FacultyFullDataDto from "../../DTOs/Data/Faculty/FacultyFullDataDto";
// import FacultyCreationDTO from "../../DTOs/ForCreation/FacultyCreationDto";
// import FacultyUpdateDTO from "../../DTOs/ForUpdate/FacultyUpdateDto";
// import FacultyDetailsDTO from "../../DTOs/Data/FacultyDetailsDto";

// Создание факультета
// export const createFaculty = createAsyncThunk(
//     "faculty/createFaculty",
//     async (data) => {
//         const dataOfDto = new FacultyCreationDTO(data);
//         const response = await FacultyService.createFaculty(dataOfDto);
//         return response;
//     }
// );

// Получение всех факультетов
export const getAllFaculties = createAsyncThunk(
    "faculty/getAllFaculties",
    async () => {
        const response = await FacultyService.getAllFaculties();

        const result = response.map(element => new FacultyFullDataDto(element))
        return result;

    }
);

// Получение факультета по ID
// export const getFacultyById = createAsyncThunk(
//     "faculty/getFacultyById",
//     async (id) => {
//         const response = await FacultyService.getFacultyById(id);
//         return new FacultyDetailsDTO(response);
//     }
// );

// Обновление факультета
// export const updateFaculty = createAsyncThunk(
//     "faculty/updateFaculty",
//     async ({id, data}) => {
//         const dataOfDto = new FacultyUpdateDTO(data);
//         const response = await FacultyService.updateFaculty(id, dataOfDto);
//         return new FacultyDetailsDTO(response);
//     }
// );

// Удаление факультета
// export const deleteFaculty = createAsyncThunk(
//     "faculty/deleteFaculty",
//     async (id) => {
//         await FacultyService.deleteFaculty(id);
//         return id;
//     }
// );

const facultySlice = createSlice({
    name: "faculty",
    initialState: {
        facultiesList: {
            data: [],
            isLoading: false,
            errors: [],
        },
        currentFaculty: {
            data: null,
            isLoading: false,
            errors: [],
        },
        operationStatus: null // 'created', 'updated', 'deleted'
    },
    reducers: {
        resetOperationStatus(state) {
            state.operationStatus = null;
        },
        clearCurrentFaculty(state) {
            state.currentFaculty.data = null;
            state.currentFaculty.errors = [];
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
                console.log('Received fac:', action.payload);
                state.facultiesList.data = action.payload;
                state.facultiesList.isLoading = false;
            })
            .addCase(getAllFaculties.rejected, (state, action) => {
                state.facultiesList.isLoading = false;
                state.facultiesList.errors = action.error.message ? [action.error.message] : ['Ошибка загрузки'];
            })

            // // Получение факультета по ID
            // .addCase(getFacultyById.pending, (state) => {
            //     state.currentFaculty.isLoading = true;
            //     state.currentFaculty.errors = [];
            // })
            // .addCase(getFacultyById.fulfilled, (state, action) => {
            //     state.currentFaculty.data = action.payload;
            //     state.currentFaculty.isLoading = false;
            // })
            // .addCase(getFacultyById.rejected, (state, action) => {
            //     state.currentFaculty.isLoading = false;
            //     state.currentFaculty.errors = action.error.message ? [action.error.message] : ['Ошибка загрузки'];
            // })

            // // Создание факультета
            // .addCase(createFaculty.pending, (state) => {
            //     state.currentFaculty.isLoading = true;
            //     state.currentFaculty.errors = [];
            // })
            // .addCase(createFaculty.fulfilled, (state, action) => {
            //     state.facultiesList.data.push(action.payload);
            //     state.currentFaculty.data = action.payload;
            //     state.currentFaculty.isLoading = false;
            //     state.operationStatus = 'created';
            // })
            // .addCase(createFaculty.rejected, (state, action) => {
            //     state.currentFaculty.isLoading = false;
            //     state.currentFaculty.errors = action.error.message ? [action.error.message] : ['Ошибка создания'];
            // })

            // // Обновление факультета
            // .addCase(updateFaculty.pending, (state) => {
            //     state.currentFaculty.isLoading = true;
            //     state.currentFaculty.errors = [];
            // })
            // .addCase(updateFaculty.fulfilled, (state, action) => {
            //     const index = state.facultiesList.data.findIndex(f => f.id === action.payload.id);
            //     if (index !== -1) {
            //         state.facultiesList.data[index] = action.payload;
            //     }
            //     state.currentFaculty.data = action.payload;
            //     state.currentFaculty.isLoading = false;
            //     state.operationStatus = 'updated';
            // })
            // .addCase(updateFaculty.rejected, (state, action) => {
            //     state.currentFaculty.isLoading = false;
            //     state.currentFaculty.errors = action.error.message ? [action.error.message] : ['Ошибка обновления'];
            // })

            // // Удаление факультета
            // .addCase(deleteFaculty.pending, (state) => {
            //     state.currentFaculty.isLoading = true;
            //     state.currentFaculty.errors = [];
            // })
            // .addCase(deleteFaculty.fulfilled, (state, action) => {
            //     state.facultiesList.data = state.facultiesList.data.filter(f => f.id !== action.payload);
            //     state.currentFaculty.data = null;
            //     state.currentFaculty.isLoading = false;
            //     state.operationStatus = 'deleted';
            // })
            // .addCase(deleteFaculty.rejected, (state, action) => {
            //     state.currentFaculty.isLoading = false;
            //     state.currentFaculty.errors = action.error.message ? [action.error.message] : ['Ошибка удаления'];
            // });
    }
});

export const { resetOperationStatus, clearCurrentFaculty } = facultySlice.actions;
export default facultySlice.reducer;