import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AudienceService from "../../services/AudienceService";

export const fetchAudiences = createAsyncThunk(
  "audiences/fetchAudiences",
  async (params, { rejectWithValue }) => {
    try {
      const response = await AudienceService.getAll(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createAudience = createAsyncThunk(
  "audiences/createAudience",
  async (audienceData, { rejectWithValue }) => {
    try {
      const response = await AudienceService.create(audienceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateAudience = createAsyncThunk(
  "audiences/updateAudience",
  async ({ id, audienceData }, { rejectWithValue }) => {
    try {
      const response = await AudienceService.update(id, audienceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteAudience = createAsyncThunk(
  "audiences/deleteAudience",
  async (id, { rejectWithValue }) => {
    try {
      await AudienceService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const audienceSlice = createSlice({
  name: "audiences",
  initialState: {
    data: [],
    isLoading: false,
    errors: [],
    currentAudience: null,
    meta: {
      total: 0,
      page: 1,
      limit: 5
    },
    searchParams: {
      buildingQuery: '',
      numberQuery: '',
      capacityQuery: ''
    }
  },
  reducers: {
    clearErrors: (state) => {
      state.errors = [];
    },
    clearCurrentAudience: (state) => {
      state.currentAudience = null;
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
      // Fetch all audiences
      .addCase(fetchAudiences.pending, (state) => {
        state.isLoading = true;
        state.errors = [];
      })
      .addCase(fetchAudiences.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data || action.payload;
        state.meta.total = action.payload.meta.totalItems || action.payload.length;
      })
      .addCase(fetchAudiences.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload ? [action.payload] : [{ message: "Unknown error" }];
      })
      
      // Create audience
      .addCase(createAudience.pending, (state) => {
        state.isLoading = true;
        state.errors = [];
      })
      .addCase(createAudience.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = [action.payload, ...state.data];
        state.meta.total += 1;
      })
      .addCase(createAudience.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload ? [action.payload] : [{ message: "Unknown error" }];
      })
      
      // Update audience
      .addCase(updateAudience.pending, (state) => {
        state.isLoading = true;
        state.errors = [];
      })
      .addCase(updateAudience.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = state.data.map(audience => 
          audience.id === action.payload.id ? action.payload : audience
        );
      })
      .addCase(updateAudience.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload ? [action.payload] : [{ message: "Unknown error" }];
      })
      
      // Delete audience
      .addCase(deleteAudience.pending, (state) => {
        state.isLoading = true;
        state.errors = [];
      })
      .addCase(deleteAudience.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = state.data.filter(audience => audience.id !== action.payload);
        state.meta.total -= 1;
      })
      .addCase(deleteAudience.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload ? [action.payload] : [{ message: "Unknown error" }];
      });
  }
});

export const { 
  clearErrors, 
  clearCurrentAudience, 
  setPage, 
  setLimit, 
  setSearchParams 
} = audienceSlice.actions;

export default audienceSlice.reducer;