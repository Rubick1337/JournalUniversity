import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import PersonService from "../../services/PersonService";
import PersonCreationDTO from "../../DTOs/ForCreation/PersonCreationDto";
import GetPersonDataForSelect from "../../DTOs/Data/GetPersonDataForSelect";
//TODO обработчик после создания
export const createPerson = createAsyncThunk("createPerson", async (data) => {
  const dataOfDto = new PersonCreationDTO(data);

  const response = await PersonService.createPerson(dataOfDto);
  return response;
});
export const getPersonsDataForSelect = createAsyncThunk(
  "getPersonsDataForSelect",
  async () => {
    const response = await PersonService.getPersonsDataForSelect();

    const result = response.map((element) => {return new GetPersonDataForSelect(element)})

    return result;
  }
);
const projectSlice = createSlice({
  name: "person",
  initialState: {
    personsDataForSelect: {
      data: [],
      isLoading: false,
      errors: [],
    },
  },
  reducers: {
    setProjects(state, action) {
      state.projects = action.payload;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      //GROUP getPersonsDataForSelect
      .addCase(getPersonsDataForSelect.pending, (state) => {
        state.personsDataForSelect.isLoading = true;
      })
      .addCase(getPersonsDataForSelect.fulfilled, (state, action) => {
        // Выводим payload для проверки
        console.log(action.payload);
        
        // Если payload - это объект, который содержит массив в свойстве data
        if (Array.isArray(action.payload)) {
          state.personsDataForSelect.data = action.payload;
        } else if (action.payload && Array.isArray(action.payload.data)) {
          // Если payload - объект с массивом внутри
          state.personsDataForSelect.data = action.payload.data;
        } else {
          state.personsDataForSelect.data = [];  // Если данных нет
        }

        state.personsDataForSelect.isLoading = false;
      })
      .addCase(getPersonsDataForSelect.rejected, (state, action) => {
        state.personsDataForSelect.isLoading = false;
        state.personsDataForSelect.errors = action.payload || [];
      });
  },
});


// Экспортируем действия и редьюсер
export const { setProjects, setLoading } = projectSlice.actions;
export default projectSlice.reducer;
