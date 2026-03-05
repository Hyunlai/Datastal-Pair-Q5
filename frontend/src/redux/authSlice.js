import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import API from "../api/axios";

const initialState = {
  userInfo: null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (data, thunkAPI) => {
    try {
      // Backend signin expects username + password; UI currently captures email + password.
      const payload = {
        username: data.email,
        password: data.password,
      };

      const response = await API.post("auth/signin/", payload);

      const userInfo = {
        user: response.data.user,
        access: response.data.access,
        refresh: response.data.refresh,
      };

      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);

      return userInfo;
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        error.response?.data?.non_field_errors?.[0] ||
        "Login failed";

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (data, thunkAPI) => {
    try {
      const payload = {
        username: data.email,
        email: data.email,
        password: data.password,
      };

      const response = await API.post("auth/signup/", payload);
      return response.data;
    } catch (error) {
      const fieldErrors = error.response?.data;
      const message =
        fieldErrors?.username?.[0] ||
        fieldErrors?.email?.[0] ||
        fieldErrors?.password?.[0] ||
        "Register failed";

      return thunkAPI.rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  },

  extraReducers: (builder) => {

    builder

      .addCase(login.pending, (state) => {
        state.loading = true;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })

      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })

      .addCase(register.pending, (state) => {
        state.loading = true;
      })

      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Register failed";
      });

  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;