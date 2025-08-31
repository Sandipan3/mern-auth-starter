import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer, { logout, tokenRefreshed } from "../slices/authSlice"; // Import actions
import api from "../api/api"; // Import the api instance

const rootReducer = combineReducers({
  auth: authReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/FLUSH",
          "persist/PURGE",
        ],
      },
    }),
});

// ==== SETUP INTERCEPTORS AFTER STORE IS CREATED ====
// Request interceptor
api.interceptors.request.use(
  (config) => {
    const { token } = store.getState().auth; // Get token from the store
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await api.get("/auth/refresh");
        const { accessToken: newToken } = refreshResponse.data;
        store.dispatch(tokenRefreshed({ token: newToken }));
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        store.dispatch(logout());
      }
    }
    return Promise.reject(error);
  }
);
// =====================================================

export const persistor = persistStore(store);
