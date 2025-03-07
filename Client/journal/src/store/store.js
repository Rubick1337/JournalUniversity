import { configureStore } from '@reduxjs/toolkit';
import personReducer from './slices/personSlice';



const store = configureStore({
    reducer: {
        person: personReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
});

export default store;