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

class TeacherPositionService extends BaseService {
  async createTeacherPosition(data) {
    const response = await BaseService.request(
      "post",
      API_ENDPOINTS.TEACHER_POSITION.CREATE,
      data
    );
    return response;
  }

  async updateTeacherPosition(id, data) {
    const response = await BaseService.request(
      "put",
      API_ENDPOINTS.TEACHER_POSITION.UPDATE.replace(':teacherPositionId', id),
      data
    );
    return response;
  }

  async deleteTeacherPosition(id) {
    const response = await BaseService.request(
      "delete",
      API_ENDPOINTS.TEACHER_POSITION.DELETE.replace(':teacherPositionId', id),
    );
    return response;
  }

  async getAllTeacherPositions({limit, page, sortBy, sortOrder, idQuery, nameQuery}) {
    let endpoint = API_ENDPOINTS.TEACHER_POSITION.GETALL;

    endpoint = addParamInEndpoint(endpoint, "limit", limit);
    endpoint = addParamInEndpoint(endpoint, "page", page);
    endpoint = addParamInEndpoint(endpoint, "sortBy", sortBy);
    endpoint = addParamInEndpoint(endpoint, "sortOrder", sortOrder);
    endpoint = addParamInEndpoint(endpoint, "idQuery", idQuery);
    endpoint = addParamInEndpoint(endpoint, "nameQuery", nameQuery);

    const response = await BaseService.request(
        "get",
        endpoint
    );
    return response;
  }

  async getTeacherPositionById(id) {
    const response = await BaseService.request(
      "get",
      API_ENDPOINTS.TEACHER_POSITION.GETBYID.replace(':teacherPositionId', id),
    );
    return response.data;
  }
}

export default new TeacherPositionService();
