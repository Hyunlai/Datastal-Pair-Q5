import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (data) => {
    
    return {
      email: data.email,
      token: "dummy_token",
    };

  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (data) => {

    // dummy register
    return {
      email: data.email,
    };

  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout: (state) => {
      state.userInfo = null;
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

      .addCase(login.rejected, (state) => {
        state.loading = false;
        state.error = "Login failed";
      })

      .addCase(register.pending, (state) => {
        state.loading = true;
      })

      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(register.rejected, (state) => {
        state.loading = false;
        state.error = "Register failed";
      });

  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;