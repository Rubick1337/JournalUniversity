import React, { useState } from 'react';

import './LoginStyle.css';

import StudentsGroup from "../../components/StudentsGroup/StudentsGroup";

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
                <StudentsGroup></StudentsGroup>
            </div>
        </main>
    );
}

export default LoginPage;