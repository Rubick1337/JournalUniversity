import React from "react";
import { Provider } from "react-redux";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import MainPage from "./pages/MainPage/Main";
import GroupListPage from "./pages/GroupListPage/GroupListPage";
import SchedulePage from "./pages/SchedulePage/SchedulePage";
import store from "./store/store";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import TestPage from "./pages/TestPage/TestPage";
import StudentTablePage from "./pages/StudentTablePage/StudentTablePage";
import DepartamentTablePage from "./pages/DepartamentTablePage/DepartamentTablePage";
import SpecilizationTablePage from "./pages/SpecilizationTablePage/SpecilizationTablePage";
import FacultiesTablePage from "./pages/FacultiesTablePage/FacultiesTablePage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import TableLearnPage from "./pages/TableLearnPage/TableLearnPage";
import TeachersTablePage from "./pages/TeachersTablePage/TeacherTablePage";
import DisciplinesTablePage from "./pages/DisciplinesTablePage/DisciplinesTablePage";
import GroupTablePage from "./pages/GroupTablePage/GroupTablePage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import StudentRaitingPage from "./pages/StudentRaitingPage/StudentRaitingPage";
import LessonCreationForm from "./pages/LessonCreationForm/LessonCreationForm";
import ContactTablePage from "./pages/ContactPage/ContactPage";
import PositionTeacherPage from "./pages/PositionTeacherPage/PositionTeacherPage";
import RoutersPage from "./pages/RoutersPage/RoutersPage";
import EducationFormPage from "./pages/EducationFormPage/EducationFormPage";
import TypeAssesmentPage from "./pages/TypeAssmentPage/TypeAssesmentPage";
import CurriculumsTable from "./components/CurriculumsTable/CurriculumsTable";
import TopicsTable from "./components/TopicsTable/TopicsTable";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { refreshUser } from "./store/slices/authSlice";
import { getRefreshToken } from "./services/tokenStorage";
import { useNavigate } from "react-router-dom";
import TopicTablePage from "./pages/TopicTablePage/TopicTablePage";
import CurruculimPage from "./pages/CurruculimPage/CurruculimPage";
// import {LessonPage} from './pages/LessonPage/LessonPage'
import GradeStudentPage from "./pages/GradeStudentPage/GradeStudentPage";
import LessonInformationPage from "./pages/LessonInformationPage/LessonInformationPage";
import AcademicBuildingPage from "./pages/AcademicBuildingPage/AcademicBuildingPage";
function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Попытаться восстановить токен из localStorage
    const refreshToken = getRefreshToken();

    if (refreshToken) {

      dispatch(refreshUser(refreshToken))
          .unwrap()
    } else {
      navigate("/");
    }
  }, [dispatch, navigate]);
  return (
    <Provider store={store}>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/welcome" element={<MainPage />} />
          <Route path="/group" element={<GroupListPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/studenttable" element={<StudentTablePage />} />
          <Route path="/departament" element={<DepartamentTablePage />} />
          <Route path="/specilization" element={<SpecilizationTablePage />} />
          <Route path="/faculties" element={<FacultiesTablePage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/curriculum/:curriculumId" element={<TableLearnPage/>}/>
          <Route path="/teachers" element={<TeachersTablePage />} />
          <Route path="/discipline" element={<DisciplinesTablePage />} />
          <Route path="/tablegroups" element={<GroupTablePage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/raiting" element={<StudentRaitingPage />} />
          <Route path="/infolesson/" element={<LessonCreationForm />} />
          <Route path="/infolesson/:lessonId" element={<LessonInformationPage/>} />
          {/* <Route path="/infolesson/:id" element={<LessonPage />} /> */}
          <Route path="/personinfo" element={<ContactTablePage />} />
          <Route path={"/positions"} element={<PositionTeacherPage />} />
          <Route path={"/router"} element={<RoutersPage />} />
          <Route path={"/educationform"} element={<EducationFormPage />} />
          <Route path={"/assesmenttype"} element={<TypeAssesmentPage />} />
          <Route path={"/curriculum"} element={<CurruculimPage />} />
          <Route path={"/topic"} element={<TopicTablePage />} />
          <Route path={"/topics"} element={<CurriculumsTable />} />
          <Route path={"/grades"} element={<GradeStudentPage />} />
          <Route path={"/academicBuildings"} element={<AcademicBuildingPage/>} />
        </Routes>
      </div>
    </Provider>
  );
}

export default App;
