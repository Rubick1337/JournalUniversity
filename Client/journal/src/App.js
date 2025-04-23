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
import InfoLessonPage from "./pages/InfoLessonPage/InfoLessonPage";
import ContactTablePage from "./pages/ContactPage/ContactPage";
import PositionTeacherPage from "./pages/PositionTeacherPage/PositionTeacherPage";
import RoutersPage from "./pages/RoutersPage/RoutersPage";
import EducationFormPage from "./pages/EducationFormPage/EducationFormPage";
import TypeAssesmentPage from "./pages/TypeAssmentPage/TypeAssesmentPage";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <nav>
          <a href="personinfo">Персональные данные</a>

          <a href="faculties">Факультеты</a>
          <a href="departament">Кафедры</a>
          <a href="discipline">Предметы</a>
          <a href="positions">Должности преподователей</a>
          <a href="teachers">Преподователи</a>

          <a href="specilization">Направления подготовки</a>
          <a href="TODO">Формы подготовки</a>

          <a href="specilization">Учебный планы</a>
          <a href="TODO">Формы атестации</a>

          <a href="curriculum">Рабочие программы</a>

          <a href="specilization">Группы</a>
          <a href="specilization">Подгруппы</a>
          <a href="specilization">Студенты</a>

          <a href="specilization">Занятия</a>
          <a href="specilization">Пропуски</a>
          <a href="specilization">Оценки</a>
          <h4></h4>
        </nav>
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
          <Route path="/tablelearn" element={<TableLearnPage />} />
          <Route path="/teachers" element={<TeachersTablePage />} />
          <Route path="/discipline" element={<DisciplinesTablePage />} />
          <Route path="/tablegroups" element={<GroupTablePage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/raiting" element={<StudentRaitingPage />} />
          <Route path="/infolesson/:id" element={<InfoLessonPage />} />
          <Route path="/personinfo" element={<ContactTablePage />} />
          <Route path={"/positions"} element={<PositionTeacherPage />} />
          <Route path={"/router"} element={<RoutersPage />} />
          <Route path={"/educationform"} element={<EducationFormPage />} />
          <Route path={"/assesmenttype"} element={<TypeAssesmentPage />} />
        </Routes>
      </div>
    </Provider>
  );
}

export default App;
