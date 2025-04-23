import $api from "../http/index";
import { API_ENDPOINTS } from "../http/apiEnpoints";
import BaseService from "./BaseService";

class AcademicSpecialtyService extends BaseService {
    async create(data) {
        const response = await BaseService.request("post", API_ENDPOINTS.ACADEMIC_SPECIALTY.CREATE, data);
        return response;
    }

    async update(code, data) {
        const response = await BaseService.request("put", API_ENDPOINTS.ACADEMIC_SPECIALTY.UPDATE.replace(":code", code), data);
        return response;
    }

    async delete(code) {
        const response = await BaseService.request("delete", API_ENDPOINTS.ACADEMIC_SPECIALTY.DELETE.replace(":code", code));
        return response;
    }

    async getAll() {
        const response = await BaseService.request("get", API_ENDPOINTS.ACADEMIC_SPECIALTY.GETALL);
        return response.data;
    }

    async getByCode(code) {
        const response = await BaseService.request("get", API_ENDPOINTS.ACADEMIC_SPECIALTY.GETBYCODE.replace(":code", code));
        return response.data;
    }
}

export default new AcademicSpecialtyService();