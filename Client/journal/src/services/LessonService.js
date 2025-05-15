import $api from "../http/index";
import { API_ENDPOINTS } from "../http/apiEnpoints";
import BaseService from "./BaseService";

class LessonService extends BaseService {
  async create(data) {
    const endpoint = API_ENDPOINTS.LESSON.CREATE;
    const response = await BaseService.request("post", endpoint, data);
    return response;
  }
  async getPairsOnDate(date) {
    const endpoint = API_ENDPOINTS.LESSON.GET_PAIRS_ON_DATE;
    const params = new URLSearchParams();
    params.append("date", date);
    const url = `${endpoint}?${params.toString()}`;
    const response = await BaseService.request("get", url);
    return response;
  }

  // async update(code, data) {
  //     const response = await BaseService.request("put", API_ENDPOINTS.ACADEMIC_SPECIALTY.UPDATE.replace(":code", code), data);
  //     return response;
  // }

  // async delete(code) {
  //     const response = await BaseService.request("delete", API_ENDPOINTS.ACADEMIC_SPECIALTY.DELETE.replace(":code", code));
  //     return response;
  // }

  // async getAlls({ limit, page, sortBy, sortOrder, codeQuery, nameQuery }) {
  //     let endpoint = API_ENDPOINTS.ACADEMIC_SPECIALTY.GETALL;

  //     // Добавляем параметры в endpoint
  //     endpoint = addParamInEndpoint(endpoint, "limit", limit);
  //     endpoint = addParamInEndpoint(endpoint, "page", page);
  //     endpoint = addParamInEndpoint(endpoint, "sortBy", sortBy);
  //     endpoint = addParamInEndpoint(endpoint, "sortOrder", sortOrder);
  //     endpoint = addParamInEndpoint(endpoint, "codeQuery", codeQuery); // Параметр для поиска по коду
  //     endpoint = addParamInEndpoint(endpoint, "nameQuery", nameQuery); // Параметр для поиска по имени

  //     // Выполняем запрос к API
  //     const response = await BaseService.request("get", endpoint);

  //     // Возвращаем данные и мета-информацию
  //     return {
  //         data: response.data,
  //         meta: response.meta
  //     };
  // }

  // async getByCode(code) {
  //     const response = await BaseService.request("get", API_ENDPOINTS.ACADEMIC_SPECIALTY.GETBYCODE.replace(":code", code));
  //     return response.data;
  // }
}

export default new LessonService();
