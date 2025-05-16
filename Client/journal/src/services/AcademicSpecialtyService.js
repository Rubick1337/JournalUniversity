import $api from "../http/index";
import { API_ENDPOINTS } from "../http/apiEnpoints";
import BaseService from "./BaseService";

const addParamInEndpoint = (endpoint, paramName, paramValue) => {
    if (paramValue === undefined || paramValue === null || paramValue === "") {
        return endpoint; // Не добавляем пустые параметры
    }

    const separator = endpoint.includes("?") ? "&" : "?";
    return `${endpoint}${separator}${paramName}=${encodeURIComponent(paramValue)}`;
};

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

    async getAlls({ limit, page, sortBy, sortOrder, codeQuery, nameQuery }) {
        let endpoint = API_ENDPOINTS.ACADEMIC_SPECIALTY.GETALL;

        // Добавляем параметры в endpoint
        endpoint = addParamInEndpoint(endpoint, "limit", limit);
        endpoint = addParamInEndpoint(endpoint, "page", page);
        endpoint = addParamInEndpoint(endpoint, "sortBy", sortBy);
        endpoint = addParamInEndpoint(endpoint, "sortOrder", sortOrder);
        endpoint = addParamInEndpoint(endpoint, "codeQuery", codeQuery); // Параметр для поиска по коду
        endpoint = addParamInEndpoint(endpoint, "nameQuery", nameQuery); // Параметр для поиска по имени

        // Выполняем запрос к API
        const response = await BaseService.request("get", endpoint);

        // Возвращаем данные и мета-информацию
        return {
            data: response.data,
            meta: response.meta
        };
    }

    async getByCode(code) {
        const response = await BaseService.request("get", API_ENDPOINTS.ACADEMIC_SPECIALTY.GETBYCODE.replace(":code", code));
        return response.data;
    }
}

export default new AcademicSpecialtyService();