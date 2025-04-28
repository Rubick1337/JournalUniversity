import { configureStore } from '@reduxjs/toolkit';
import personReducer from './slices/personSlice';
import facultyReducer from './slices/facultySlice';
import teacherPositionReducer from './slices/teacherPositionSlice';
import educationFormReducer from './slices/educationFormSlice';
import assessmentTypeReducer from './slices/assessmentTypeSlice';
import academicReducer from './slices/academicSpecialtySlice';
import departmentSlice from "./slices/departmentSlice";
import teacherSlice from "./slices/teacherSlice";

const store = configureStore({
    reducer: {
        person: personReducer,
        faculty: facultyReducer,
        teacherPositions: teacherPositionReducer,
        educationForms: educationFormReducer,
        assessmentTypes: assessmentTypeReducer,
        academicSpecialties: academicReducer,
        departments: departmentSlice,
        teachers:teacherSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
});

export default store;