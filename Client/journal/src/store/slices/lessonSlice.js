import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import LessonService from "../../services/LessonService";

export const createAvsenteeism = createAsyncThunk(
  "lesson/createAvsenteeism",
  async (data, { rejectWithValue }) => {
    try {
      const response = await LessonService.create(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const lessonSlice = createSlice({
  name: "lesson",
  initialState: {

  },
  reducers: {},
//   extraReducers: (builder) => {
//     builder

//       .addCase(getForStudent.pending, (state) => {
//         state.studentlesson.isLoading = true;
//         state.studentlesson.errors = [];
//       })
//       .addCase(getForStudent.fulfilled, (state, action) => {
//         state.studentlesson.isLoading = false;
//         state.studentlesson.data = action.payload;
//       })
//       .addCase(getForStudent.rejected, (state, action) => {
//         state.studentlesson.isLoading = false;
//         state.studentlesson.errors = Array.isArray(action.payload)
//           ? action.payload
//           : [{ message: action.payload }];
//       });
//   },
});

export const {} = lessonSlice.actions;

export default lessonSlice.reducer;
