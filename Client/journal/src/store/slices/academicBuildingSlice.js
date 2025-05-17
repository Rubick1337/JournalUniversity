import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AcademicBuildingService from "../../services/AcademicBuildingService";

export const fetchAcademicBuildings = createAsyncThunk(
  "academicBuildings/fetchAcademicBuildings",
  async (params, { rejectWithValue }) => {
    try {
      const response = await AcademicBuildingService.getAll(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createAcademicBuilding = createAsyncThunk(
  "academicBuildings/createAcademicBuilding",
  async (buildingData, { rejectWithValue }) => {
    try {
      const response = await AcademicBuildingService.create(buildingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateAcademicBuilding = createAsyncThunk(
  "academicBuildings/updateAcademicBuilding",
  async ({ id, buildingData }, { rejectWithValue }) => {
    try {
      const response = await AcademicBuildingService.update(id, buildingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteAcademicBuilding = createAsyncThunk(
  "academicBuildings/deleteAcademicBuilding",
  async (id, { rejectWithValue }) => {
    try {
      await AcademicBuildingService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const academicBuildingSlice = createSlice({
  name: "academicBuildings",
  initialState: {
    data: [],
    isLoading: false,
    errors: [],
    currentBuilding: null,
    meta: {
      total: 0,
      page: 1,
      limit: 5
    },
    searchParams: {
      nameQuery: '',
      addressQuery: ''
    }
  },
  reducers: {
    clearErrors: (state) => {
      state.errors = [];
    },
    clearCurrentBuilding: (state) => {
      state.currentBuilding = null;
    },
    setPage: (state, action) => {
      state.meta.page = action.payload;
    },
    setLimit: (state, action) => {
      state.meta.limit = action.payload;
    },
    setSearchParams: (state, action) => {
      state.searchParams = { ...state.searchParams, ...action.payload };
      state.meta.page = 1; // Reset to first page when search changes
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all buildings
      .addCase(fetchAcademicBuildings.pending, (state) => {
        state.isLoading = true;
        state.errors = [];
      })
      .addCase(fetchAcademicBuildings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data || action.payload;
        console.log(action.payload)
        state.meta.total = action.payload.meta.totalItems || action.payload.length;
      })
      .addCase(fetchAcademicBuildings.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload ? [action.payload] : [{ message: "Unknown error" }];
      })
      
      // Create building
      .addCase(createAcademicBuilding.pending, (state) => {
        state.isLoading = true;
        state.errors = [];
      })
      .addCase(createAcademicBuilding.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = [action.payload, ...state.data];
        state.meta.total += 1;
      })
      .addCase(createAcademicBuilding.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload ? [action.payload] : [{ message: "Unknown error" }];
      })
      
      // Update building
      .addCase(updateAcademicBuilding.pending, (state) => {
        state.isLoading = true;
        state.errors = [];
      })
      .addCase(updateAcademicBuilding.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = state.data.map(building => 
          building.id === action.payload.id ? action.payload : building
        );
      })
      .addCase(updateAcademicBuilding.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload ? [action.payload] : [{ message: "Unknown error" }];
      })
      
      // Delete building
      .addCase(deleteAcademicBuilding.pending, (state) => {
        state.isLoading = true;
        state.errors = [];
      })
      .addCase(deleteAcademicBuilding.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = state.data.filter(building => building.id !== action.payload);
        state.meta.total -= 1;
      })
      .addCase(deleteAcademicBuilding.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload ? [action.payload] : [{ message: "Unknown error" }];
      });
  }
});

export const { 
  clearErrors, 
  clearCurrentBuilding, 
  setPage, 
  setLimit, 
  setSearchParams 
} = academicBuildingSlice.actions;

export default academicBuildingSlice.reducer;