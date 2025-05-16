import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import UserService from "../../services/authService";
import { clearTokens, saveTokens } from "../../services/tokenStorage";

// Async actions

export const loginUser = createAsyncThunk(
    "user/login",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await UserService.login(credentials);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const registerUser = createAsyncThunk(
    "user/register",
    async (data, { rejectWithValue }) => {
        try {
            const response = await UserService.create(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const logoutUser = createAsyncThunk(
    "user/logout",
    async (refreshToken, { rejectWithValue }) => {
        try {
            await UserService.logout(refreshToken);
            return true;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const refreshUser = createAsyncThunk(
    "user/refresh",
    async (refreshToken, { rejectWithValue }) => {
        try {
            const response = await UserService.refresh(refreshToken);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Function to get tokens from localStorage
const getTokensFromLocalStorage = () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    return { accessToken, refreshToken };
};

// Slice

const userSlice = createSlice({
    name: "user",
    initialState: {
        user: {
            student_id: null,
            teacher_id: null,
        },
        tokens: getTokensFromLocalStorage(),
        isLoading: false,
        errors: [],
    },
    reducers: {
        clearUserErrors: (state) => {
            state.errors = [];
        },
        resetUserState: (state) => {
            state.user = null;
            state.tokens = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                if (action.payload) {
                    const { accessToken, refreshToken, user } = action.payload;
                    state.tokens = { accessToken, refreshToken };
                    state.user = user;
                    saveTokens({ accessToken, refreshToken });
                } else {
                    state.errors = [{ message: "Invalid response from server" }];
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = [{ message: action.payload }];
            })

            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = [{ message: action.payload }];
            })

            .addCase(logoutUser.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.tokens = null;
                state.user = null;
                clearTokens();
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = [{ message: action.payload }];
            })

            .addCase(refreshUser.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(refreshUser.fulfilled, (state, action) => {

                if (action.payload?.accessToken && action.payload?.refreshToken) {
                    const { accessToken, refreshToken, user } = action.payload;
                    state.tokens = { accessToken, refreshToken };
                    state.user = user;
                    state.errors = null;
                    state.isAuthenticated = true;
                    saveTokens({ accessToken, refreshToken });
                } else {
                    console.error("Invalid payload structure:", action.payload); // <-- Логируем ошибку
                    state.errors = [{ message: "Invalid response from server" }];
                    state.isAuthenticated = false;
                }
            })

            .addCase(refreshUser.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = [{ message: action.payload }];
            });
    }
});

export const { clearUserErrors, resetUserState } = userSlice.actions;

export default userSlice.reducer;
