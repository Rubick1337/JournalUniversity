import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AudienceService from "../../services/AudienceService";

export const getAllAudience = createAsyncThunk(
  "audience/getAllaudience",
  async ({numberAudienceQuery, academicBuildingIdQuery }, { rejectWithValue }) => {
    try {
      const response = await AudienceService.getAll(numberAudienceQuery, academicBuildingIdQuery);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const audienceSlice = createSlice({
  name: "audience",
  initialState: {
    isLoading: false,
    errors: null,
    data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllAudience.pending, (state) => {
        state.isLoading = true;
        state.errors = null;
      })
      .addCase(getAllAudience.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(getAllAudience.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = null;
      });
  },
});

export default audienceSlice.reducer;
