import React from 'react';
import Login from '../components/Login/Login';
import InfoMessage from '../components/InfoMessegeLogin/InfoMessegaLogin';
import "./LoginStyle.css"
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