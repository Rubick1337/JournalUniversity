import axios from 'axios';
import { API_ENDPOINTS } from "./apiEnpoints";

const API_NAME = 'api';
const API_PORT = 5000;

export const API_URL = `http://localhost:${API_PORT}/${API_NAME}`;

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
});
//TODO - мой refresh токен выкидывает на страницу логи, а не надо так
$api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

$api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        
        // Проверяем, что ошибка — 401, запрос ещё не был повторён, и ошибка не вызвана сетевой проблемой
        if (
            error.response &&
            error.response.status === 401 &&
            originalRequest &&
            !originalRequest._isRetry
        ) {
            originalRequest._isRetry = true;

            try {
                const response = await axios.get(`${API_URL}${API_ENDPOINTS.USER.UPDATE_TOKEN}`, {
                    withCredentials: true,
                });
                // Сохраняем новый токен и повторяем запрос
                localStorage.setItem('token', response.data.accessToken);
                originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
                return $api.request(originalRequest);
            } catch (e) {
                console.log(e)
                window.location.href = '/';
            }
        }

        // Если это другая ошибка — выбрасываем её
        throw error;
    }
);

export default $api;
