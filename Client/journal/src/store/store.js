import { configureStore } from '@reduxjs/toolkit';
import personReducer from './slices/personSlice';
import facultyReducer from './slices/facultySlice';
import teacherPositionReducer from './slices/teacherPositionSlice';
import educationFormReducer from './slices/educationFormSlice';
import assessmentTypeReducer from './slices/assessmentTypeSlice';
import academicReducer from './slices/academicSpecialtySlice';
import departmentSlice from "./slices/departmentSlice";

const store = configureStore({
    reducer: {
        person: personReducer,
        faculty: facultyReducer,
        teacherPositions: teacherPositionReducer,
        educationForms: educationFormReducer,
        assessmentTypes: assessmentTypeReducer,
        academicSpecialties: academicReducer,
        departments: departmentSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
});

export default store;