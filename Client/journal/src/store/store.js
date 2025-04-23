import { configureStore } from '@reduxjs/toolkit';
import personReducer from './slices/personSlice';
import facultyReducer from './slices/facultySlice';
import teacherPositionReducer from './slices/teacherPositionSlice';
import educationFormReducer from './slices/educationFormSlice';


const store = configureStore({
    reducer: {
        person: personReducer,
        faculty: facultyReducer,
        teacherPositions: teacherPositionReducer,
        educationForms: educationFormReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
});

export default store;