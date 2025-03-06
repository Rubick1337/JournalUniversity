import React from 'react';
import LoginPage from './pages/LoginPage/LoginPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {Route, Routes } from 'react-router-dom';
import MainPage from "./pages/MainPage/Main";
import GroupListPage from "./pages/GroupListPage/GroupListPage";
import SchedulePage from "./pages/SchedulePage/SchedulePage";

function App() {
  return (
      <div className="App">
          <Routes>
              <Route path="/" element={<LoginPage/>}/>
              <Route path="/welcome" element={<MainPage/>}/>
              <Route path="/group" element={<GroupListPage/>}/>
              <Route path="/schedule" element={<SchedulePage/>}/>
          </Routes>
      </div>
  );
}

export default App;