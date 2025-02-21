import React from 'react';

function Login() {
    return (
        <div className="login">

            <form>
                <h2>Вход</h2>
                <div>
                    <input type="text" placeholder="Логин"/>
                </div>
                <div>
                    <input type="password" placeholder="Пароль"/>
                </div>
                <button type="submit">Вход</button>
            </form>
            <div>
            <button className="login-green">Вход по единой записи СПбПУ</button>
            </div>
            <div>
                <a href="/register">Еще не регистрировались? Создать учетную запись</a>
            </div>
        </div>
    );
}

export default Login;