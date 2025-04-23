import $api from "../http/index";
import { API_ENDPOINTS } from "../http/apiEnpoints";
import BaseService from "./BaseService";

class TeacherService extends BaseService {
    async createTeacher(data) {
        const response = await BaseService.request("post", API_ENDPOINTS.TEACHER.CREATE, data);
        return response;
    }

    async updateTeacher(id, data) {
        const response = await BaseService.request("put", API_ENDPOINTS.TEACHER.UPDATE.replace(":teacherId",id), data);
        return response;
    }

    async deleteTeacher(id) {
        const response = await BaseService.request("delete",API_ENDPOINTS.TEACHER.DELETE.replace(":teacherId",id));
        return response;
    }

    async getAllFaculties() {
        //TODO query params
        const response = await BaseService.request("get", API_ENDPOINTS.TEACHER.GETALL);
        return response.data;
    }

    async getTeacherById(id) {
        const response = await BaseService.request("get", API_ENDPOINTS.TEACHER.GETBYID.replace(":teacherId",id));
        return response.data;
    }
}

export default new TeacherService();