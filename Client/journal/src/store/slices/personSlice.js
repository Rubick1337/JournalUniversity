import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import PersonService from "../../services/PersonService";
import PersonCreationDTO from "../../DTOs/ForCreation/PersonCreationDto";

export const createPerson = createAsyncThunk(
  "createPerson",
  async (data) => {

    const dataOfDto = new PersonCreationDTO(data);

    const response = await PersonService.createPerson(dataOfDto);
    return response;
  }
);
const projectSlice = createSlice({
  name: "person",
  initialState: {
    
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

  },
});

// Экспортируем действия и редьюсер
export const { setProjects, setLoading } = projectSlice.actions;
export default projectSlice.reducer;
