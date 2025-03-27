import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '@/services/authService';

interface User {
  id: string;
  uid: string;
  email?: string;
  phone?: string;
  role: 'user' | 'admin';
  balance: {
    currency: 'USDT' | 'BTC' | 'USDC' | 'ETH';
    amount: number;
  }[];
  walletAddress?: string;
  referralCode: string;
  referredBy?: string;
  isVerified: boolean;
  canWinSeconds: boolean;
  createdAt: string; 
  updatedAt: string; 
  token: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

export const fetchUserProfile = createAsyncThunk('auth/fetchUserProfile', async (_, { rejectWithValue }) => {
  try {
    const user = await authService.getProfile();
    return user;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      authService.logout();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
