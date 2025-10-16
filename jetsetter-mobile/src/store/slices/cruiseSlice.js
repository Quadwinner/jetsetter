import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cruiseService from '../../services/cruiseService';

// Async thunks
export const searchCruises = createAsyncThunk(
  'cruise/searchCruises',
  async (searchParams, { rejectWithValue }) => {
    try {
      const result = await cruiseService.searchCruises(searchParams);
      if (result.success) {
        return result;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getCruiseDetails = createAsyncThunk(
  'cruise/getCruiseDetails',
  async (cruiseId, { rejectWithValue }) => {
    try {
      const result = await cruiseService.getCruiseDetails(cruiseId);
      if (result.success) {
        return result;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCruiseBooking = createAsyncThunk(
  'cruise/createBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const result = await cruiseService.createBooking(bookingData);
      if (result.success) {
        return result;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveCruiseBooking = createAsyncThunk(
  'cruise/saveBooking',
  async (bookingInfo, { rejectWithValue }) => {
    try {
      const result = await cruiseService.saveBooking(bookingInfo);
      if (result.success) {
        return result;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  // Search state
  searchResults: [],
  searchParams: null,
  searchLoading: false,
  searchError: null,

  // Details state
  selectedCruise: null,
  detailsLoading: false,
  detailsError: null,

  // Booking state
  bookingData: null,
  bookingLoading: false,
  bookingError: null,
  bookingSuccess: false,

  // Save state
  saveLoading: false,
  saveError: null,
  saveSuccess: false,
};

const cruiseSlice = createSlice({
  name: 'cruise',
  initialState,
  reducers: {
    // Clear search results
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchParams = null;
      state.searchError = null;
    },

    // Set selected cruise
    setSelectedCruise: (state, action) => {
      state.selectedCruise = action.payload;
    },

    // Clear selected cruise
    clearSelectedCruise: (state) => {
      state.selectedCruise = null;
      state.detailsError = null;
    },

    // Set booking data
    setBookingData: (state, action) => {
      state.bookingData = action.payload;
    },

    // Clear booking data
    clearBookingData: (state) => {
      state.bookingData = null;
      state.bookingSuccess = false;
      state.bookingError = null;
    },

    // Clear all errors
    clearErrors: (state) => {
      state.searchError = null;
      state.detailsError = null;
      state.bookingError = null;
      state.saveError = null;
    },

    // Reset booking success
    resetBookingSuccess: (state) => {
      state.bookingSuccess = false;
      state.saveSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Search cruises
      .addCase(searchCruises.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchCruises.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload.cruises || [];
        state.searchParams = action.meta.arg;
        state.searchError = null;
      })
      .addCase(searchCruises.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload;
        state.searchResults = [];
      })

      // Get cruise details
      .addCase(getCruiseDetails.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })
      .addCase(getCruiseDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedCruise = action.payload.cruise;
        state.detailsError = null;
      })
      .addCase(getCruiseDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError = action.payload;
      })

      // Create cruise booking
      .addCase(createCruiseBooking.pending, (state) => {
        state.bookingLoading = true;
        state.bookingError = null;
        state.bookingSuccess = false;
      })
      .addCase(createCruiseBooking.fulfilled, (state, action) => {
        state.bookingLoading = false;
        state.bookingData = action.payload;
        state.bookingSuccess = true;
        state.bookingError = null;
      })
      .addCase(createCruiseBooking.rejected, (state, action) => {
        state.bookingLoading = false;
        state.bookingError = action.payload;
        state.bookingSuccess = false;
      })

      // Save cruise booking
      .addCase(saveCruiseBooking.pending, (state) => {
        state.saveLoading = true;
        state.saveError = null;
        state.saveSuccess = false;
      })
      .addCase(saveCruiseBooking.fulfilled, (state, action) => {
        state.saveLoading = false;
        state.saveSuccess = true;
        state.saveError = null;
      })
      .addCase(saveCruiseBooking.rejected, (state, action) => {
        state.saveLoading = false;
        state.saveError = action.payload;
        state.saveSuccess = false;
      });
  },
});

export const {
  clearSearchResults,
  setSelectedCruise,
  clearSelectedCruise,
  setBookingData,
  clearBookingData,
  clearErrors,
  resetBookingSuccess,
} = cruiseSlice.actions;

export default cruiseSlice.reducer;



