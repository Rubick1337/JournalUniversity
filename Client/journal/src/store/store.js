import { configureStore } from '@reduxjs/toolkit';
import personReducer from './slices/personSlice';
import facultyReducer from './slices/facultySlice';
import teacherPositionReducer from './slices/teacherPositionSlice';
import educationFormReducer from './slices/educationFormSlice';
import assessmentTypeReducer from './slices/assessmentTypeSlice';
import curriculumReducer from './slices/curriculumSlice';


const store = configureStore({
    reducer: {
        person: personReducer,
        faculty: facultyReducer,
        teacherPositions: teacherPositionReducer,
        educationForms: educationFormReducer,
        assessmentTypes: assessmentTypeReducer,
        curriculum: curriculumReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
});

export default store;