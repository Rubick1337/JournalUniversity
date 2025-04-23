import $api from "../http/index";
import { API_ENDPOINTS } from "../http/apiEnpoints";
import BaseService from "./BaseService";

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

  async getAlls() {
    //TODO query params
    const response = await BaseService.request(
      "get",
      API_ENDPOINTS.CURRICULUM.GETALL
    );
    return response.data;
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
