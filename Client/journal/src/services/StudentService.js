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

class StudentService extends BaseService {
  async createStudent(data) {
    console.log(data);
    const response = await BaseService.request(
      "post",
      API_ENDPOINTS.STUDENT.CREATE,
      data
    );
    return response;
  }

  async updateStudent(id, data) {
    const response = await BaseService.request(
      "put",
      API_ENDPOINTS.STUDENT.UPDATE.replace(':id', id),
      data
    );
    return response;
  }

  async deleteStudent(id) {
    const response = await BaseService.request(
      "delete",
      API_ENDPOINTS.STUDENT.DELETE.replace(':id', id),
    );
    return response;
  }

  async getAllStudents({
                         limit,
                         page,
                         sortBy,
                         sortOrder,
                         idQuery,
                         surnameQuery,
                         nameQuery,
                         groupQuery,
                         subgroupQuery,
                         parentQuery,
                         reprimandQuery
                       }) {
    let endpoint = API_ENDPOINTS.STUDENT.GETALL;

    endpoint = addParamInEndpoint(endpoint, "limit", limit);
    endpoint = addParamInEndpoint(endpoint, "page", page);
    endpoint = addParamInEndpoint(endpoint, "sortBy", sortBy);
    endpoint = addParamInEndpoint(endpoint, "sortOrder", sortOrder);
    endpoint = addParamInEndpoint(endpoint, "idQuery", idQuery);
    endpoint = addParamInEndpoint(endpoint, "surnameQuery", surnameQuery);
    endpoint = addParamInEndpoint(endpoint, "nameQuery", nameQuery);
    endpoint = addParamInEndpoint(endpoint, "groupQuery", groupQuery);
    endpoint = addParamInEndpoint(endpoint, "subgroupQuery", subgroupQuery);
    endpoint = addParamInEndpoint(endpoint, "parentQuery", parentQuery);
    endpoint = addParamInEndpoint(endpoint, "reprimandQuery", reprimandQuery);

    const response = await BaseService.request("get", endpoint);
    return response;
  }

  async getStudentById(id) {
    const response = await BaseService.request(
      "get",
      API_ENDPOINTS.STUDENT.GETBYID.replace(':id', id),
    );
    return response.data;
  }
}

export default new StudentService();
