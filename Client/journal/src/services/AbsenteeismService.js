import $api from "../http/index";
import { API_ENDPOINTS } from "../http/apiEnpoints";
import BaseService from "./BaseService";

const addParamInEndpoint = (endpoint, paramName, paramValue) => {
  if (paramValue === undefined || paramValue === null || paramValue === "") {
    return endpoint; // Не добавляем пустые параметры
  }

  const separator = endpoint.includes("?") ? "&" : "?";
  return `${endpoint}${separator}${paramName}=${encodeURIComponent(
    paramValue
  )}`;
};

class AbsenteeismService extends BaseService {
  async create(data) {
    const endpoint = API_ENDPOINTS.ABSENTEEISM.CREATE;

    const response = await BaseService.request("post", endpoint, data);
    return response;
  }
  async getForStudent(studentId) {
    //todo add studentId in query
    const endpoint = API_ENDPOINTS.ABSENTEEISM.GET_FOR_STUDENT;
    const params = new URLSearchParams();
    params.append("studentId", studentId);
    const url = `${endpoint}?${params.toString()}`;
    const response = await BaseService.request("get", url);
    return response;
  }
  async update(absenteeismId, data) {
      const response = await BaseService.request("put", API_ENDPOINTS.ABSENTEEISM.UPDATE.replace(":absenteeismId", absenteeismId), data);
      return response;
  }

  async delete(absenteeismId) {
      const response = await BaseService.request("delete", API_ENDPOINTS.ABSENTEEISM.DELETE.replace(":absenteeismId", absenteeismId));
      return response;
  }

  async getAlls({ limit = 100, page, studentIdQuery, lessonIdQuery }) {
      let endpoint = API_ENDPOINTS.ABSENTEEISM.GETALL;

      // Добавляем параметры в endpoint
      endpoint = addParamInEndpoint(endpoint, "limit", limit);
      endpoint = addParamInEndpoint(endpoint, "page", page);
      endpoint = addParamInEndpoint(endpoint, "lessonIdQuery", lessonIdQuery); 
      endpoint = addParamInEndpoint(endpoint, "studentIdQuery", studentIdQuery); 

      // Выполняем запрос к API
      const response = await BaseService.request("get", endpoint);

      // Возвращаем данные и мета-информацию
      return {
          data: response.data,
          meta: response.meta
      };
  }


}

export default new AbsenteeismService();
