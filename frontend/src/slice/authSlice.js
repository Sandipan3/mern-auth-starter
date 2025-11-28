import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api"; // Axios instance with baseURL + withCredentials

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

/**
 * LOGIN (Email/Password)
 * Calls: POST /auth/login
 * Response: { status: "success", data: { accessToken } }
 */
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", credentials);
      return res.data.data.accessToken;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

/**
 * GET USER PROFILE
 * Calls: GET /auth/profile
 * Axios interceptor already attaches Authorization header.
 */
export const getUser = createAsyncThunk(
  "auth/getUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/auth/profile");
      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);

/**
 * REFRESH TOKEN (optional manual usage)
 * Calls: POST /auth/refresh
 * Normally handled automatically by axios interceptor on 401.
 */
export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/refresh");
      return res.data.data.accessToken;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to refresh token"
      );
    }
  }
);

/**
 * LOGOUT
 * Calls: POST /auth/logout
 * Backend clears refresh token cookie.
 */
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/auth/logout");
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

/**
 * HANDLE EXTERNAL TOKEN (Google OAuth)
 * - Access token comes from URL: /auth/callback?access_token=XYZ
 * 1. Save token in Redux
 * 2. Fetch user profile
 * 3. If anything fails → clear auth state
 */
export const handleExternalToken = createAsyncThunk(
  "auth/handleExternalToken",
  async (token, { dispatch, rejectWithValue }) => {
    try {
      //  Put token into Redux state
      dispatch(tokenRefreshed(token));

      //  Fetch user profile with new token (unwrap to throw on error)
      const user = await dispatch(getUser()).unwrap();

      return user;
    } catch (error) {
      // On failure, clear auth state by logging out
      await dispatch(logoutUser());
      return rejectWithValue("Failed to fetch user data after external login.");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Used by:
     * - Axios response interceptor (on refresh)
     * - handleExternalToken
     */
    tokenRefreshed: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // =============== LOGIN ===============
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.token = null;
      })

      // =============== GET USER PROFILE ===============
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      // =============== REFRESH TOKEN (manual) ===============
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      // =============== LOGOUT ===============
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        // Even if API logout fails, we clear local auth state
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload;
      })

      // =============== EXTERNAL TOKEN (GOOGLE) ===============
      .addCase(handleExternalToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleExternalToken.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(handleExternalToken.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      });
  },
});

export const { tokenRefreshed } = authSlice.actions;
export const authReducer = authSlice.reducer;

// SELECTORS
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentError = (state) => state.auth.error;
export const selectCurrentLoading = (state) => state.auth.loading;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
