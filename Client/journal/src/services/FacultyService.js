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

class FacultyService extends BaseService {
    async create(data) {
        const requestData = {
            name: data.name,
            full_name: data.full_name,
            dean_person_id: data.dean_person_id
        };

        const response = await $api.post(API_ENDPOINTS.Faculty.CREATE, requestData);
        return response.data;
    }

    async update(id, data) {
        const response = await BaseService.request(
            "put",
            API_ENDPOINTS.Faculty.UPDATE.replace(':facultyId', id),
            data
        );
        return response.data;
    }

    async delete(id) {
        const response = await BaseService.request(
            "delete",
            API_ENDPOINTS.Faculty.DELETE.replace(':facultyId', id)
        );
        return response.data;
    }

    async getAll({
                     page = 1,
                     limit = 10,
                     sortBy = "name",
                     sortOrder = "ASC",
                     idQuery = "",
                     nameQuery = "",
                     fullNameQuery = "",
                     deanQuery = ""
                 }) {
        let endpoint = API_ENDPOINTS.Faculty.GETALL;

        // Добавляем параметры пагинации и сортировки
        endpoint = addParamInEndpoint(endpoint, "page", page);
        endpoint = addParamInEndpoint(endpoint, "limit", limit);
        endpoint = addParamInEndpoint(endpoint, "sortBy", sortBy);
        endpoint = addParamInEndpoint(endpoint, "sortOrder", sortOrder);

        // Добавляем параметры поиска
        endpoint = addParamInEndpoint(endpoint, "idQuery", idQuery);
        endpoint = addParamInEndpoint(endpoint, "nameQuery", nameQuery);
        endpoint = addParamInEndpoint(endpoint, "fullNameQuery", fullNameQuery);
        endpoint = addParamInEndpoint(endpoint, "deanQuery", deanQuery);

        const response = await BaseService.request("get", endpoint);

        return {
            data: response.data,
            meta: response.meta
        };
    }

    async getById(id) {
        const response = await BaseService.request(
            "get",
            API_ENDPOINTS.Faculty.GETBYID.replace(':facultyId', id)
        );
        return response.data;
    }

    // Метод для получения факультета с расширенной информацией
    async getFacultyWithDetails(id) {
        const response = await BaseService.request(
            "get",
            API_ENDPOINTS.Faculty.GETBYID.replace(':facultyId', id) + '?includeDetails=true'
        );
        return response.data;
    }
}

export default new FacultyService();