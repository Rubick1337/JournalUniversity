import { configureStore } from '@reduxjs/toolkit';
import personReducer from './slices/personSlice';
import facultyReducer from './slices/facultySlice';



const store = configureStore({
    reducer: {
        person: personReducer,
        faculty: facultyReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
});

export default store;