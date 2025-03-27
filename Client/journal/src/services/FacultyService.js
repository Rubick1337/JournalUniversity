import $api from "../http/index";
import { API_ENDPOINTS } from "../http/apiEnpoints";
import BaseService from "./BaseService";

class FacultyService extends BaseService {
    async createFaculty(data) {
        const response = await this.request("post", API_ENDPOINTS.Faculty.CREATE_Faculty, data);
        return response;
    }

    async updateFaculty(id, data) {
        const response = await this.request("put", `${API_ENDPOINTS.Faculty.UPDATE_Faculty}/${id}`, data);
        return response;
    }

    async deleteFaculty(id) {
        const response = await this.request("delete", `${API_ENDPOINTS.Faculty.DELETE_Faculty}/${id}`);
        return response;
    }

    async getAllFaculties() {
        const response = await this.request("get", API_ENDPOINTS.Faculty.GETALL_Faculty);
        return response.data;
    }

    async getFacultyById(id) {
        const response = await this.request("get", `${API_ENDPOINTS.Faculty.GETIDE_Faculty}/${id}`);
        return response.data;
    }
}

export default new FacultyService();