import $api from "../http/index";
import { API_ENDPOINTS } from "../http/apiEnpoints";
import BaseService from "./BaseService";

class FacultyService extends BaseService {
    async createFaculty(data) {
        const response = await BaseService.request("post", API_ENDPOINTS.Faculty.CREATE, data);
        return response;
    }

    async updateFaculty(id, data) {
        const response = await BaseService.request("put", API_ENDPOINTS.Faculty.UPDATE.replace(":facultyId",id), data);
        return response;
    }

    async deleteFaculty(id) {
        const response = await BaseService.request("delete",API_ENDPOINTS.Faculty.DELETE.replace(":facultyId",id));
        return response;
    }

    async getAllFaculties() {
        //TODO query params
        const response = await BaseService.request("get", API_ENDPOINTS.Faculty.GETALL);
        return response.data;
    }

    async getFacultyById(id) {
        const response = await BaseService.request("get", API_ENDPOINTS.Faculty.GETBYID.replace(":facultyId",id));
        return response.data;
    }
}

export default new FacultyService();