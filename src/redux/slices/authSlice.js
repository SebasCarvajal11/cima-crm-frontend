import { createSlice } from '@reduxjs/toolkit';
import { AUTH } from '../../constants';

const initialState = {
  user: JSON.parse(localStorage.getItem(AUTH.STORAGE_KEYS.USER)) || null,
  accessToken: localStorage.getItem(AUTH.STORAGE_KEYS.ACCESS_TOKEN) || null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.status = 'succeeded';
      state.error = null;
    },
    setAuthError: (state, action) => {
      state.status = 'failed';
      state.error = action.payload || 'Error en la autenticación';
    },
    setAuthLoading: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem(AUTH.STORAGE_KEYS.USER);
      localStorage.removeItem(AUTH.STORAGE_KEYS.ACCESS_TOKEN);
    },
  },
});

export const { setCredentials, setAuthError, setAuthLoading, logout } = authSlice.actions;
export default authSlice.reducer;
