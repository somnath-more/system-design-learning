import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';
import { AuthResponse, LoginRequest, RegisterRequest, Role } from '../../types';
import toast from 'react-hot-toast';

interface AuthState {
  user: AuthResponse | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: authService.getUser(),
  isAuthenticated: authService.isAuthenticated(),
  loading: false,
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      authService.saveAuth(response);
      toast.success('Login successful!');
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      authService.saveAuth(response);
      toast.success('Registration successful!');
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      return rejectWithValue(message);
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      authService.logout();
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      toast.success('Logged out successfully');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
    // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.loading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectUserRole = (state: { auth: AuthState }) => state.auth.user?.role;
export const hasRole = (state: { auth: AuthState }, role: Role) => state.auth.user?.role === role;
