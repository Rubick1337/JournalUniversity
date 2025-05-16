import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import personService from "../../services/PersonService";

// Асинхронные действия
const fetchPersons = createAsyncThunk(
  "persons/fetchPersons",
  async (
    {
      limit,
      page,
      sortBy,
      sortOrder,
      surnameQuery,
      nameQuery,
      middlenameQuery,
      phoneNumberQuery,
      emailQuery,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await personService.getAll(
        limit,
        page,
        sortBy,
        sortOrder,
        surnameQuery,
        nameQuery,
        middlenameQuery,
        phoneNumberQuery,
        emailQuery
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const fetchPersonsByFullName = createAsyncThunk(
  "persons/fetchPersonsByFullName",
  async (
    { limit, page, sortBy, sortOrder, fullNameQuery },
    
    { rejectWithValue }
  ) => {
    try {
      const response = await personService.getAllByFullName({
        limit,
        page,
        sortBy,
        sortOrder,
        fullNameQuery
    });

      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const addPerson = createAsyncThunk(
  "persons/addPerson",
  async (personData, { rejectWithValue }) => {
    try {
      const response = await personService.create(personData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const updatePerson = createAsyncThunk(
  "persons/updatePerson",
  async ({ id, personData }, { rejectWithValue }) => {
    try {
      const response = await personService.update(id, personData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const deletePerson = createAsyncThunk(
  "persons/deletePerson",
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
  name: "person",
  initialState: {
    data: [],
    meta: {},
    isLoading: false,
    errors: [],

    list: {
      data: [],
      meta: {},
      isLoading: false,
      errors: [],
    },
  },
  reducers: {
    clearErrors: (state) => {
      state.errors = [];
    },
    setPersonPage: (state, action) => {
      state.meta.page = action.payload;
    },
    setPersonLimit: (state, action) => {
      state.meta.limit = action.payload;
    },
    setPersonSearchParams: (state, action) => {
      state.searchParams = action.payload;
    },
    // Новый редюсер для очистки списка
    clearPersonList: (state) => {
      state.list.data = [];
      state.list.meta = {};
      state.list.errors = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Загрузка persons по ФИО
      .addCase(fetchPersonsByFullName.pending, (state) => {
        state.list.isLoading = true;
        state.list.errors = [];
      })
      .addCase(fetchPersonsByFullName.fulfilled, (state, action) => {
        state.list.isLoading = false;
        state.list.data = action.payload.data;
        state.list.meta = action.payload.meta;
      })
      .addCase(fetchPersonsByFullName.rejected, (state, action) => {
        state.list.isLoading = false;
        state.list.errors = Array.isArray(action.payload)
          ? action.payload
          : [{ message: action.payload }];
      })
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
        state.data = state.data.map((person) =>
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
        state.data = state.data.filter(
          (person) => person.id !== action.payload
        );
      })
      .addCase(deletePerson.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = Array.isArray(action.payload)
          ? action.payload
          : [{ message: action.payload }];
      });
  },
});

// Экспортируем все необходимое
export const {
  clearErrors: clearPersonErrors,
  setPersonPage,
  setPersonLimit,
  setPersonSearchParams,
} = personSlice.actions;

export {
  fetchPersons,
  fetchPersonsByFullName,
  addPerson,
  updatePerson,
  deletePerson,
};

// Алиас для совместимости
export const createPerson = addPerson;

export default personSlice.reducer;
