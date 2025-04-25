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

class DepartmentService extends BaseService {
  async create(data) {
    const requestData = {
      name: data.name,
      full_name: data.full_name,
      faculty_id: data.faculty_id, // Прямая передача ID
      chairperson_of_the_department_person_id: data.head_person_id // Прямая передача ID
    };

    console.log('Отправляемые данные:', requestData);
    const response = await $api.post(API_ENDPOINTS.DEPARTMENT.CREATE, requestData);
    return response.data;
  }

  async update(id, data) {
    const response = await BaseService.request(
        "put",
        API_ENDPOINTS.DEPARTMENT.UPDATE.replace(':departmentId', id),
        data
    );
    return response;
  }

  async delete(id) {
    const response = await BaseService.request(
        "delete",
        API_ENDPOINTS.DEPARTMENT.DELETE.replace(':departmentId', id),
    );
    return response;
  }

  async getAll({
                            page = 1,
                            limit = 10,
                            sortBy = "name",
                            sortOrder = "ASC",
                            idQuery = "",
                            nameQuery = "",
                            fullNameQuery = "",
                            facultyQuery = "",
                            headQuery = ""
                          }) {
    let endpoint = API_ENDPOINTS.DEPARTMENT.GETALL;

    // Добавляем параметры пагинации и сортировки
    endpoint = addParamInEndpoint(endpoint, "page", page);
    endpoint = addParamInEndpoint(endpoint, "limit", limit);
    endpoint = addParamInEndpoint(endpoint, "sortBy", sortBy);
    endpoint = addParamInEndpoint(endpoint, "sortOrder", sortOrder);

    // Добавляем параметры поиска
    endpoint = addParamInEndpoint(endpoint, "idQuery", idQuery);
    endpoint = addParamInEndpoint(endpoint, "nameQuery", nameQuery);
    endpoint = addParamInEndpoint(endpoint, "fullNameQuery", fullNameQuery);
    endpoint = addParamInEndpoint(endpoint, "facultyQuery", facultyQuery);
    endpoint = addParamInEndpoint(endpoint, "headQuery", headQuery);

    const response = await BaseService.request("get", endpoint);

    return {

      data: response.data,
      meta: response.meta
    };
  }

  async getById(id) {
    const response = await BaseService.request(
        "get",
        API_ENDPOINTS.DEPARTMENT.GETBYID.replace(':departmentId', id),
    );
    return response.data;
  }

  // Метод для получения кафедры с расширенной информацией
  async getDepartmentWithDetails(id) {
    const response = await BaseService.request(
        "get",
        API_ENDPOINTS.DEPARTMENT.GETBYID.replace(':departmentId', id) + '?includeDetails=true'
    );
    return response.data;
  }
}

export default new DepartmentService();