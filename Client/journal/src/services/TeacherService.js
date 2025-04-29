import $api from "../http/index";
import { API_ENDPOINTS } from "../http/apiEnpoints";
import BaseService from "./BaseService";

const addParamInEndpoint = (endpoint, paramName, paramValue) => {
    if (paramValue === undefined || paramValue === null || paramValue === "") {
        return endpoint;
    }
    const separator = endpoint.includes("?") ? "&" : "?";
    return `${endpoint}${separator}${paramName}=${encodeURIComponent(paramValue)}`;
};

class TeacherService extends BaseService {
    async create(data) {
        const requestData = {
            person_id: data.person_id,
            department_id: data.department_id,
            teaching_position_id: data.teaching_position_id,
        };

        const response = await $api.post(API_ENDPOINTS.TEACHER.CREATE, requestData);
        return response.data;
    }

    async update(id, data) {
        const response = await BaseService.request(
            "put",
            API_ENDPOINTS.TEACHER.UPDATE.replace(':teacherId', id),
            data
        );
        return response.data;
    }

    async delete(id) {
        const response = await BaseService.request(
            "delete",
            API_ENDPOINTS.TEACHER.DELETE.replace(':teacherId', id),
        );
        return response.data;
    }

    async getAll({
                     page = 1,
                     limit = 10,
                     sortBy = "id",
                     sortOrder = "ASC",
                     idQuery = "",
                     personQuery = "",
                     departmentQuery = "",
                     positionQuery = ""
                 }) {
        let endpoint = API_ENDPOINTS.TEACHER.GETALL;

        // Добавляем параметры пагинации и сортировки
        endpoint = addParamInEndpoint(endpoint, "page", page);
        endpoint = addParamInEndpoint(endpoint, "limit", limit);
        endpoint = addParamInEndpoint(endpoint, "sortBy", sortBy);
        endpoint = addParamInEndpoint(endpoint, "sortOrder", sortOrder);

        // Добавляем параметры поиска
        endpoint = addParamInEndpoint(endpoint, "idQuery", idQuery);
        endpoint = addParamInEndpoint(endpoint, "personQuery", personQuery);
        endpoint = addParamInEndpoint(endpoint, "departmentQuery", departmentQuery);
        endpoint = addParamInEndpoint(endpoint, "positionQuery", positionQuery);

        const response = await BaseService.request("get", endpoint);

        return {
            data: response.data,
            meta: response.meta
        };
    }

    async getById(id) {
        const response = await BaseService.request(
            "get",
            API_ENDPOINTS.TEACHER.GETBYID.replace(':teacherId', id),
        );
        return response.data;
    }

    // Метод для получения преподавателя с расширенной информацией
    async getTeacherWithDetails(id) {
        const response = await BaseService.request(
            "get",
            API_ENDPOINTS.TEACHER.GETBYID.replace(':teacherId', id) + '?includeDetails=true'
        );
        return response.data;
    }
}

export default new TeacherService();