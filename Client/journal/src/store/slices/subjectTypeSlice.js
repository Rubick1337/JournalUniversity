import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import SubjectTypeService from "../../services/SubjectTypeService";

export const getAllSubjectTypes = createAsyncThunk(
  "subjectType/getAllSubjectTypes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await SubjectTypeService.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const subjectTypeSliceSlice = createSlice({
  name: "subjectType",
  initialState: {
    isLoading: false,
    errors: null,
    data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllSubjectTypes.pending, (state) => {
        state.isLoading = true;
        state.errors = null;
      })
      .addCase(getAllSubjectTypes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(getAllSubjectTypes.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = null;
      });
  },
});

export default subjectTypeSliceSlice.reducer;
