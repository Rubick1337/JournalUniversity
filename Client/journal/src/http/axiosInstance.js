import axios from "axios";
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from "../services/tokenStorage";
import UserService from "../services/authService";

const instance = axios.create({
    baseURL: "http://localhost:5000", // укажи актуальный базовый URL
    headers: {
        "Content-Type": "application/json",
    },
});

// Установка accessToken в каждом запросе
instance.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Обновление токена при ошибке 401
instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            getRefreshToken()
        ) {
            originalRequest._retry = true;
            try {
                const res = await UserService.refresh(getRefreshToken());
                const { accessToken, refreshToken } = res.data;
                saveTokens({ accessToken, refreshToken });
                originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
                return instance(originalRequest); // повтор запроса
            } catch (refreshError) {
                clearTokens();
                window.location.href = "/"; // редирект на логин
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default instance;
