import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import logger from '../../utils/logger';

// Thunk para obtener la lista de usuarios
// Recibe el token como argumento para evitar dependencia de localStorage/store interno
export const fetchUsers = createAsyncThunk(
  'roles/fetchUsers', 
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users`, { 
        headers: { 'accesstoken': token } 
      });
      return response.data;
    } catch (err) {
      logger.error('Error fetching users in roleSlice:', err);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateRole = createAsyncThunk(
  'roles/updateRole', 
  async ({ userId, role, token }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/users/${userId}`, 
        { role }, 
        { headers: { 'accesstoken': token } }
      );
      return { userId, role, data: response.data };
    } catch (err) {
      logger.error('Error updating role in roleSlice:', err);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const roleSlice = createSlice({
  name: 'roles',
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        // El backend retorna { status, users } o directamente el array
        state.users = action.payload.users || action.payload || [];
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        const { userId, role } = action.payload;
        const user = state.users.find(u => (u.userId || u.id) === userId);
        if (user) {
          user.role = role;
        }
      });
  },
});

export default roleSlice.reducer;
