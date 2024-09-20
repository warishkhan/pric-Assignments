import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

// Replace with your Unsplash API key
const UNSPLASH_API_KEY = '1WY7ekEXSrMt0ALSYPX_kF0PNnJLbvo5vzJXnFE3vJw';
const UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos';

// Async thunk to fetch images
export const fetchImages = createAsyncThunk(
  'images/fetchImages',
  async ({query, page = 1}, {getState}) => {
    const response = await axios.get(UNSPLASH_API_URL, {
      params: {
        query,
        page,
        per_page: 10,
        client_id: UNSPLASH_API_KEY,
      },
    });

    // Check if more images are available
    const hasMore = response.data.results.length > 0;
    return {
      images: response.data.results,
      page,
      hasMore,
    };
  },
);

const imagesSlice = createSlice({
  name: 'images',
  initialState: {
    images: [],
    loading: false,
    error: null,
    page: 1,
    query: '',
    hasMore: true, // To track if there are more images to load
  },
  reducers: {
    resetImages: state => {
      state.images = [];
      state.page = 1;
      state.hasMore = true; // Reset hasMore when a new search is made
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchImages.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchImages.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.page === 1) {
          state.images = action.payload.images;
        } else {
          state.images = [...state.images, ...action.payload.images];
        }

        state.page = action.payload.page;
        state.hasMore = action.payload.hasMore; // Set hasMore based on the results
        state.query = action.meta.arg.query; // Update the query in the state
      })
      .addCase(fetchImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {resetImages} = imagesSlice.actions;

export default imagesSlice.reducer;
