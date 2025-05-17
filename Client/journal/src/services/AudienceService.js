import $api from "../http/index";
import { API_ENDPOINTS } from "../http/apiEnpoints";
import BaseService from "./BaseService";
const ID_FIELD_NAME = 'audienceId'
class AudienceService extends BaseService {
  async getAll(paramsData) {
    const endpoint = API_ENDPOINTS.AUDIENCE.GETALL;

    const params = new URLSearchParams();
    if (paramsData.limit) {
      params.append("limit", paramsData.limit);
    }
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
    if (paramsData.numberQuery) {
      params.append("numberQuery", paramsData.numberQuery);
    }
    if (paramsData.capacityQuery) {
      params.append("capacityQuery", paramsData.capacityQuery);
    }
    if (paramsData.buildingIdQuery) {
      params.append("buildingIdQuery", paramsData.buildingIdQuery);
    }
    if (paramsData.buildingNameQuery) {
      params.append("buildingNameQuery", paramsData.buildingNameQuery);
    }
    const url = `${endpoint}?${params.toString()}`;
    console.log(url)
    const response = await BaseService.request("get", url);
    return response;
  }

  async create(data) {
    const response = await BaseService.request(
      "post",
      API_ENDPOINTS.AUDIENCE.CREATE,
      data
    );
    return response;
  }

  async update(id, data) {
    const response = await BaseService.request(
      "put",
      API_ENDPOINTS.AUDIENCE.UPDATE.replace(`:${ID_FIELD_NAME}`, id),
      data
    );
    return response;
  }
  async getById(id) {
    const response = await BaseService.request(
      "get",
      API_ENDPOINTS.AUDIENCE.GETBYID.replace(`:${ID_FIELD_NAME}`, id)
    );
    return response;
  }
  async delete(id) {
    const response = await BaseService.request(
      "delete",
      API_ENDPOINTS.AUDIENCE.DELETE.replace(`:${ID_FIELD_NAME}`, id)
    );
    return response;
  }
}

export default new AudienceService();
