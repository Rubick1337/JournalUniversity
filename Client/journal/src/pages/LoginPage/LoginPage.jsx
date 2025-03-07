import React, { useState } from 'react';

import './LoginStyle.css';
import InfoMessage from "../../components/InfoMessegeLogin/InfoMessegaLogin";
import Login from "../../components/Login/Login";

function LoginPage() {
    return (
        <main>
            <div className="container__login">
                <InfoMessage />
                <Login />
            </div>
        </main>
    );
}
export default LoginPage;