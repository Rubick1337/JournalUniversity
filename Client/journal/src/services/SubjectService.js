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

class SubjectService extends BaseService {
    async create(data) {
            const subjectData = {
                name: data.name,
                department_id: data.department_id
            };
            console.log(subjectData);
            const response = await BaseService.request(
                "post",
                API_ENDPOINTS.SUBJECT.CREATE,
                subjectData
            );
        console.log('Ответ от сервера:', response.data);
            return response.data;

    }

    async update(id, data) {
        const response = await BaseService.request(
            "put",
            API_ENDPOINTS.SUBJECT.UPDATE.replace(':subjectId', id),
            data
        );
        return response;
    }

    async delete(id) {
        const response = await BaseService.request(
            "delete",
            API_ENDPOINTS.SUBJECT.DELETE.replace(':subjectId', id),
        );
        return response;
    }

    async getAll({ limit, page, sortBy, sortOrder, idQuery,departmentIdQuery, nameQuery }) {
        let endpoint = API_ENDPOINTS.SUBJECT.GETALL;
        endpoint = addParamInEndpoint(endpoint, "limit", limit);
        endpoint = addParamInEndpoint(endpoint, "page", page);
        endpoint = addParamInEndpoint(endpoint, "sortBy", sortBy);
        endpoint = addParamInEndpoint(endpoint, "sortOrder", sortOrder);
        endpoint = addParamInEndpoint(endpoint, "idQuery", idQuery);
        endpoint = addParamInEndpoint(endpoint, "nameQuery", nameQuery);
        endpoint = addParamInEndpoint(endpoint, "departmentIdQuery", departmentIdQuery);

        const response = await BaseService.request("get", endpoint);

        return {
            data: response.data,
            meta: response.meta
        };
    }

    async getById(id) {
        const response = await BaseService.request(
            "get",
            API_ENDPOINTS.SUBJECT.GETBYID.replace(':subjectId', id),
        );
        return response.data;
    }
}

export default new SubjectService();