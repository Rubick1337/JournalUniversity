import React from 'react';
import LoginPage from '../src/pages/LoginPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {Route, Routes } from 'react-router-dom';

function App() {
  return (
      <div className="App">
          <Routes>
              <Route path="/" element={<LoginPage/>}/>
          </Routes>
      </div>
  );
}

export default App;