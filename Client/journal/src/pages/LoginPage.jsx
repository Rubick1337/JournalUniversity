import React, { useState } from "react";
import Login from "../components/Login/Login";
import InfoMessage from "../components/InfoMessegeLogin/InfoMessegaLogin";
import Slider from "../components/Slider/Slider";
import Calendar from "../components/Calendar/Calendar";
import Schedule from "../components/Schedule/Schedule";
import "./LoginStyle.css";
import StudentList from "../components/StudentList/StudentList";
import ContainerPersonCreation from "../components/ContainerPersonCreation/ContainerPersonCreation";

function LoginPage() {
  const [selectedDay, setSelectedDay] = useState(null);

  const handleDaySelect = (dayOfWeek) => {
    setSelectedDay(dayOfWeek);
  };

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
      </div>
    </main>
  );
}

export default LoginPage;
