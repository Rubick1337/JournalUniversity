import { API_ENDPOINTS } from "../http/apiEnpoints";
import BaseService from "./BaseService";
const ID_FIELD_NAME = "typeOfSemesterId";

class TypeOfSemesterService extends BaseService {
  async getAll(paramsData = {}) {
    const endpoint = API_ENDPOINTS.TYPE_OF_SEMESTER.GETALL;

    const params = new URLSearchParams();
    if (paramsData.limit) {
      params.append("limit", paramsData.limit);
    }
    console.log(paramsData);
    if (paramsData.page) {
      params.append("page", paramsData.page);
    }
    if (paramsData.sortBy) {
      params.append("sortBy", paramsData.sortBy);
    }
    if (paramsData.sortOrder) {
      params.append("sortOrder", paramsData.sortOrder);
    }
    if (paramsData.idQuery) {
      params.append("idQuery", paramsData.idQuery);
    }
    if (paramsData.nameQuery) {
      params.append("nameQuery", paramsData.nameQuery);
    }
    if (paramsData.startDateQuery) {
      params.append("startDateQuery", paramsData.startDateQuery);
    }
    if (paramsData.endDateQuery) {
      params.append("endDateQuery", paramsData.endDateQuery);
    }
    const url = `${endpoint}?${params.toString()}`;
    const response = await BaseService.request("get", url);
    return response;
  }

  async create(data) {
    const response = await BaseService.request(
      "post",
      API_ENDPOINTS.TYPE_OF_SEMESTER.CREATE,
      data
    );
    return response;
  }

  async update(id, data) {
    const response = await BaseService.request(
      "put",
      API_ENDPOINTS.TYPE_OF_SEMESTER.UPDATE.replace(`:${ID_FIELD_NAME}`, id),
      data
    );
    return response;
  }
  async getById(id) {
    const response = await BaseService.request(
      "get",
      API_ENDPOINTS.TYPE_OF_SEMESTER.GETBYID.replace(`:${ID_FIELD_NAME}`, id)
    );
    return response;
  }
  async delete(id) {
    const response = await BaseService.request(
      "delete",
      API_ENDPOINTS.TYPE_OF_SEMESTER.DELETE.replace(`:${ID_FIELD_NAME}`, id)
    );
    return response;
  }
}

export default new TypeOfSemesterService();
