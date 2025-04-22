import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import personService from '../../services/PersonService';

// Асинхронные действия
export const fetchPersons = createAsyncThunk(
  'persons/fetchPersons',
  async ({ limit, page, sortBy, sortOrder, surnameQuery, nameQuery,middlename, phoneNumberQuery, emailQuery }, { rejectWithValue }) => {
    try {
      const response = await personService.getAll(
        limit,
        page,
        sortBy,
        sortOrder,
        surnameQuery,
        nameQuery,
        middlename,
        phoneNumberQuery,
        emailQuery
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addPerson = createAsyncThunk(
  'persons/addPerson',
  async (personData, { rejectWithValue }) => {
    try {
      const response = await personService.create(personData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updatePerson = createAsyncThunk(
  'persons/updatePerson',
  async ({ id, personData }, { rejectWithValue }) => {
    try {
      const response = await personService.update(id, personData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deletePerson = createAsyncThunk(
  'persons/deletePerson',
  async (id, { rejectWithValue }) => {
    try {
      await personService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Создаем слайс
const personSlice = createSlice({
  name: 'persons',
  initialState: {
    data: [],
    meta: {},
    isLoading: false,
    errors: [],
  },
  reducers: {
    clearErrors: (state) => {
      state.errors = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Загрузка persons
      .addCase(fetchPersons.pending, (state) => {
        state.isLoading = true;
        state.errors = [];
      })
      .addCase(fetchPersons.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchPersons.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = Array.isArray(action.payload) 
          ? action.payload 
          : [{ message: action.payload }];
      })
      
      // Добавление person
      .addCase(addPerson.pending, (state) => {
        state.isLoading = true;
        state.errors = [];
      })
      .addCase(addPerson.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data.unshift(action.payload);
      })
      .addCase(addPerson.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = Array.isArray(action.payload) 
          ? action.payload 
          : [{ message: action.payload }];
      })
      
      // Обновление person
      .addCase(updatePerson.pending, (state) => {
        state.isLoading = true;
        state.errors = [];
      })
      .addCase(updatePerson.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedPerson = action.payload;
        state.data = state.data.map(person =>
          person.id === updatedPerson.id ? updatedPerson : person
        );
      })
      .addCase(updatePerson.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = Array.isArray(action.payload) 
          ? action.payload 
          : [{ message: action.payload }];
      })
      
      // Удаление person
      .addCase(deletePerson.pending, (state) => {
        state.isLoading = true;
        state.errors = [];
      })
      .addCase(deletePerson.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = state.data.filter(person => person.id !== action.payload);
      })
      .addCase(deletePerson.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = Array.isArray(action.payload) 
          ? action.payload 
          : [{ message: action.payload }];
      });
  },
});

export const { clearErrors } = personSlice.actions;
export default personSlice.reducer;