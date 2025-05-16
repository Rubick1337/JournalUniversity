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

class AssessmentTypeService extends BaseService {
  async create(data) {
    const response = await BaseService.request(
      "post",
      API_ENDPOINTS.ASSESSMENT_TYPE.CREATE,
      data
    );
    return response;
  }

  async update(id, data) {
    const response = await BaseService.request(
      "put",
      API_ENDPOINTS.ASSESSMENT_TYPE.UPDATE.replace(':id', id),
      data
    );
    return response;
  }

  async delete(id) {
    const response = await BaseService.request(
      "delete",
      API_ENDPOINTS.ASSESSMENT_TYPE.DELETE.replace(':id', id),
    );
    return response;
  }

  async getAlls({ limit, page, sortBy, sortOrder, idQuery, nameQuery }) {
    let endpoint = API_ENDPOINTS.ASSESSMENT_TYPE.GETALL;

    endpoint = addParamInEndpoint(endpoint, "limit", limit);
    endpoint = addParamInEndpoint(endpoint, "page", page);
    endpoint = addParamInEndpoint(endpoint, "sortBy", sortBy);
    endpoint = addParamInEndpoint(endpoint, "sortOrder", sortOrder);
    endpoint = addParamInEndpoint(endpoint, "idQuery", idQuery);
    endpoint = addParamInEndpoint(endpoint, "nameQuery", nameQuery);

    const response = await BaseService.request("get", endpoint);

    return {
      data: response.data,
      meta: response.meta
    };
  }


  async getById(id) {
    const response = await BaseService.request(
      "get",
      API_ENDPOINTS.ASSESSMENT_TYPE.GETBYID.replace(':id', id),
    );
    return response.data;
  }
}

export default new AssessmentTypeService();
