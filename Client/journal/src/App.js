import React from 'react';
import { Provider } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage'; // Используем путь из версии main
import MainPage from "./pages/MainPage/Main";
import GroupListPage from "./pages/GroupListPage/GroupListPage";
import SchedulePage from "./pages/SchedulePage/SchedulePage";
import store from './store/store';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
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

function App() {
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
          <Route path="/tablelearn" element={<TableLearnPage />} />
          <Route path="/teachers" element={<TeachersTablePage/>} />
          <Route path="/discipline" element={<DisciplinesTablePage />} />
          <Route path="/tablegroups" element={<GroupTablePage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/curriculum" element={<StudentRaitingPage />} />
        </Routes>
      </div>
    </Provider>
  );
}

export default App;