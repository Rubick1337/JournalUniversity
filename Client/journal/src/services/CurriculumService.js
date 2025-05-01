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

class CurriculumService extends BaseService {
  async create(data) {
    const response = await BaseService.request(
        "post",
        API_ENDPOINTS.CURRICULUM.CREATE,
        data
    );
    return response;
  }

  async update(id, data) {
    console.log(data)
    const response = await BaseService.request(
        "put",
        API_ENDPOINTS.CURRICULUM.UPDATE.replace(':id', id),
        data

    );
    return response;
  }

  async delete(id) {
    const response = await BaseService.request(
        "delete",
        API_ENDPOINTS.CURRICULUM.DELETE.replace(':id', id),
    );
    return response;
  }

  async getAlls({
                  page = 1,
                  limit = 10,
                  sortBy = "year_of_specialty_training",
                  sortOrder = "ASC",
                  idQuery = "",
                  yearQuery = "",
                  specialtyQuery = "",
                  educationFormQuery = ""
                }) {
    let endpoint = API_ENDPOINTS.CURRICULUM.GETALL;

    // Пагинация и сортировка
    endpoint = addParamInEndpoint(endpoint, "page", page);
    endpoint = addParamInEndpoint(endpoint, "limit", limit);
    endpoint = addParamInEndpoint(endpoint, "sortBy", sortBy);
    endpoint = addParamInEndpoint(endpoint, "sortOrder", sortOrder);

    // Параметры фильтрации
    endpoint = addParamInEndpoint(endpoint, "idQuery", idQuery);
    endpoint = addParamInEndpoint(endpoint, "yearQuery", yearQuery);
    endpoint = addParamInEndpoint(endpoint, "specialtyQuery", specialtyQuery);
    endpoint = addParamInEndpoint(endpoint, "educationFormQuery", educationFormQuery);

    const response = await BaseService.request("get", endpoint);
    console.log('API Response:', response);
    return {
      data: response.data,
      meta: response.meta
    };
  }

  async getById(id) {
    const response = await BaseService.request(
        "get",
        API_ENDPOINTS.CURRICULUM.GETBYID.replace(':id', id),
    );
    return response.data;
  }
}

export default new CurriculumService();