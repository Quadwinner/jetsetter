import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BookingState {
  bookings: any[];
  currentBooking: any | null;
  searchResults: any[];
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  bookings: [],
  currentBooking: null,
  searchResults: [],
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setBookings: (state, action: PayloadAction<any[]>) => {
      state.bookings = action.payload;
    },
    setCurrentBooking: (state, action: PayloadAction<any>) => {
      state.currentBooking = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<any[]>) => {
      state.searchResults = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { 
  setBookings, 
  setCurrentBooking, 
  setSearchResults, 
  setLoading, 
  setError, 
  clearError 
} = bookingSlice.actions;
export default bookingSlice.reducer;
