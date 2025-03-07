import React, { useState, useEffect } from "react";
import Login from "../components/Login/Login";
import InfoMessage from "../components/InfoMessegeLogin/InfoMessegaLogin";
import Slider from "../components/Slider/Slider";
import Calendar from "../components/Calendar/Calendar";
import Schedule from "../components/Schedule/Schedule";
import "./LoginStyle.css";
import StudentList from "../components/StudentList/StudentList";
import ContainerPersonCreation from "../components/ContainerPersonCreation/ContainerPersonCreation";
import ContainerFacultyCreate from "../components/ContainerFacultyCreate/ContainerFacultyCreate";
import {getPersonsDataForSelect} from '../store/slices/personSlice'
import { useDispatch, useSelector } from "react-redux";

function LoginPage() {
  const [selectedDay, setSelectedDay] = useState(null);
  const dispatch = useDispatch();

  const handleDaySelect = (dayOfWeek) => {
    setSelectedDay(dayOfWeek);
  };
  useEffect(() => {
    dispatch(getPersonsDataForSelect());
  }, [dispatch]);
  return (
    <main>
      <div className="container__login">
        {/*<InfoMessage />*/}
        {/*<Login />*/}
        {/*<Slider studentId={1} />*/}
        <Calendar onDaySelect={handleDaySelect} />
        {selectedDay && <Schedule selectedDay={selectedDay} />}
        <StudentList></StudentList>

        <ContainerPersonCreation />
        <ContainerFacultyCreate/>
      </div>
    </main>
  );
}

export default LoginPage;
