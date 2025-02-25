import React from 'react';
import Login from '../components/Login/Login';
import InfoMessage from '../components/InfoMessegeLogin/InfoMessegaLogin';
import "./LoginStyle.css"
import Calendar from "../components/Calendar/Calendar";
function LoginPage() {
    return (
        <main>
            <div className="container__login">
                <InfoMessage />
                <Login />
                <Calendar />
            </div>
        </main>
    );
}

export default LoginPage;