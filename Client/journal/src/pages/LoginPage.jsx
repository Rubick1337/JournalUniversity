import React, { useState } from 'react';
import Login from '../components/Login/Login';
import InfoMessage from '../components/InfoMessegeLogin/InfoMessegaLogin';
import Slider from '../components/Slider/Slider';
import Calendar from '../components/Calendar/Calendar';
import Schedule from '../components/Schedule/Schedule';
import './LoginStyle.css';
import StudentList from "../components/StudentList/StudentList";
import Header from "../components/Header/Header";

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
                <Header></Header>
                {/*<Calendar onDaySelect={handleDaySelect} />*/}
                {/*{selectedDay && <Schedule selectedDay={selectedDay} />}*/}
                {/*<StudentList></StudentList>*/}
            </div>
        </main>
    );
}

export default LoginPage;