import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AbsenteeismService from "../../services/AbsenteeismService";

// Асинхронные действия
export const getForStudent = createAsyncThunk(
  "absenteeism/getForStudent",
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await AbsenteeismService.getForStudent(studentId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createAvsenteeism = createAsyncThunk(
  "absenteeism/createAvsenteeism",
  async (data, { rejectWithValue }) => {
    try {
      const response = await AbsenteeismService.create(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const absenteeismSlice = createSlice({
  name: "absenteeism",
  initialState: {
    studentAbsenteeism: {
      isLoading: false,
      errors: {},
      data: {},
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getForStudent.pending, (state) => {
        state.studentAbsenteeism.isLoading = true;
        state.studentAbsenteeism.errors = [];
      })
      .addCase(getForStudent.fulfilled, (state, action) => {
        state.studentAbsenteeism.isLoading = false;
        state.studentAbsenteeism.data = action.payload;
      })
      .addCase(getForStudent.rejected, (state, action) => {
        state.studentAbsenteeism.isLoading = false;
        state.studentAbsenteeism.errors = Array.isArray(action.payload)
          ? action.payload
          : [{ message: action.payload }];
      });
  },
});

export const {} = absenteeismSlice.actions;

export default absenteeismSlice.reducer;
