import $api from "../http/index";
import { API_ENDPOINTS } from "../http/apiEnpoints";
import BaseService from "./BaseService";

class SubjectService extends BaseService {
    async createSubject(data) {
        const response = await BaseService.request("post", API_ENDPOINTSSUBJECT.CREATE, data);
        return response;
    }

    async updateSubject(id, data) {
        const response = await BaseService.request("put", API_ENDPOINTSSUBJECT.UPDATE.replace(":subjectId", id), data);
        return response;
    }

    async deleteSubject(id) {
        const response = await BaseService.request("delete",  API_ENDPOINTSSUBJECT.DELETE.replace(":subjectId", id));
        return response;
    }

    async getAllFaculties() {
        //TODO query params
        const response = await BaseService.request("get", API_ENDPOINTSSUBJECT.GETALL);
        return response.data;
    }

    async getSubjectById(id) {
        const response = await BaseService.request("get", API_ENDPOINTSSUBJECT.GETBYID.replace(":subjectId", id));
        return response.data;
    }
}

export default new SubjectService();