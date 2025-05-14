import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { errors, isLoading } = useSelector((state) => state.user);

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(loginUser({ login, password }));

        if (!result.error) {
            if (remember) {
                localStorage.setItem('rememberLogin', login);
            } else {
                localStorage.removeItem('rememberLogin');
            }
            navigate('/welcome');
        }
    };

    return (
        <div className="login">
            <form onSubmit={handleSubmit}>
                <h2>Вход</h2>
                <div>
                    <input
                        type="text"
                        placeholder="Логин"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="remember__login">
                    <input
                        type="checkbox"
                        id="remember"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                    />
                    <label htmlFor="remember"> Запомнить логин</label>
                </div>
                <button type="submit" disabled={isLoading}>
                    <div className="img__login"></div>
                    <div className="login__text">{isLoading ? 'Вход...' : 'Вход'}</div>
                </button>
                {errors.map((err, idx) => (
                    <div key={idx} style={{ color: 'red', marginTop: 10 }}>
                        {err.message}
                    </div>
                ))}
            </form>
            <div className="footer__login">
                <h3>Для работы с приложением нужен аккаунт</h3>
                <h3>Пожалуйста, создайте или войдите в аккаунт</h3>
            </div>
        </div>
    );
}

export default Login;
