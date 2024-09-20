import {configureStore} from '@reduxjs/toolkit';
import imagesReducer from './src/redux/imagesSlice';

export const store = configureStore({
  reducer: {
    images: imagesReducer,
  },
});

export default store;
