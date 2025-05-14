import BaseService from "./BaseService";
import { API_ENDPOINTS } from "../http/apiEnpoints";

class UserService extends BaseService {
    async login(data) {
        const response = await BaseService.request("post", API_ENDPOINTS.USER.LOGIN, data);
        return response;
    }

    async create(data) {
        const response = await BaseService.request("post", API_ENDPOINTS.USER.CREATE, data);
        return response;
    }

    async logout(refreshToken) {
        const response = await BaseService.request("post", API_ENDPOINTS.USER.LOGOUT, { token: refreshToken });
        return response;
    }

    async refresh(refreshToken) {
        const response = await BaseService.request("post", API_ENDPOINTS.USER.REFRESH, { token: refreshToken });
        return response;  // <- response УЖЕ содержит { accessToken, refreshToken, user }
    }

}

export default new UserService();
