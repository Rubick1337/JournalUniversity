import { configureStore } from "@reduxjs/toolkit";
import personReducer from "./slices/personSlice";
import facultyReducer from "./slices/facultySlice";
import teacherPositionReducer from "./slices/teacherPositionSlice";
import educationFormReducer from "./slices/educationFormSlice";
import assessmentTypeReducer from "./slices/assessmentTypeSlice";
import academicReducer from "./slices/academicSpecialtySlice";
import departmentSlice from "./slices/departmentSlice";
import teacherSlice from "./slices/teacherSlice";
import curriculumReducer from "./slices/curriculumSlice";
import subjectSlice from "./slices/subjectSlice";
import estimationTypeSlice from "./slices/estimationTypeSlice";
import curriculumSubjectSlice from "./slices/curriculumSubjectSlice";
import topicReducer from "./slices/topicSlice";
import groupSlice from "./slices/groupSlice";
import studentJournalReducer from "./slices/studentJournalSlice";
import studentSlice from "./slices/studentSlice";
import SubgroupSlice from "./slices/subgroupSlice";
import StudentLabsSlice from "./slices/studentLabsSlice";
import userSlice from "./slices/authSlice";
import scheduleSlice from "./slices/scheduleSlice";
import absenteeismSlice from "./slices/absenteeismSlice";


const store = configureStore({
  reducer: {
    person: personReducer,
    faculty: facultyReducer,
    teacherPositions: teacherPositionReducer,
    educationForms: educationFormReducer,
    assessmentTypes: assessmentTypeReducer,
    academicSpecialties: academicReducer,
    departments: departmentSlice,
    teachers: teacherSlice,
    curriculums: curriculumReducer,
    subjects:subjectSlice,
    estimationTypes: estimationTypeSlice,
    curriculumSubject: curriculumSubjectSlice,
    topics: topicReducer,
    groups: groupSlice,
    studentJournal: studentJournalReducer,
    students: studentSlice,
    subgroups: SubgroupSlice,
    studentLabs: StudentLabsSlice,
    user: userSlice,
    schedule: scheduleSlice,
    absenteeism: absenteeismSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),

});

export default store;
