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
            <div className="remember__login">
                <input type="checkbox" id="remember"/>
                <label htmlFor="remember"> Запомнить логин</label>
            </div>
                <button type="submit">
                    <div className="img__login"></div>
                    <div className="login__text">Вход</div>
                </button>
            </form>
            <div>
            <button className="login-green">
                <div className="login__parent__img"></div>
                <div className="text__parent__button">Регистрация</div>
            </button>
            </div>
            <div className="footer__login">
                <h3>Для работы с приложение нужен аккаунт</h3>
                <h3>Пожалуйста, создайте или войдите в аккаунт</h3>
            </div>
        </div>
    );
}

export default Login;