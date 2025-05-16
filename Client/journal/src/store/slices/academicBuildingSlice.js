import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AcademicBuildingService from "../../services/AcademicBuildingService";

export const getAllAcademicBuilding = createAsyncThunk(
  "academicBuilding/getAllAcademicBuilding",
  async (_, { rejectWithValue }) => {
    try {
      const response = await AcademicBuildingService.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const academicBuildingSlice = createSlice({
  name: "academicBuilding",
  initialState: {
    isLoading: false,
    errors: null,
    data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllAcademicBuilding.pending, (state) => {
        state.isLoading = true;
        state.errors = null;
      })
      .addCase(getAllAcademicBuilding.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(getAllAcademicBuilding.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = null;
      });
  },
});

export default academicBuildingSlice.reducer;
