import $api from "../http/index";
import { API_ENDPOINTS } from "../http/apiEnpoints";
import BaseService from "./BaseService";

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

  async getAlls() {
    //TODO query params
    const response = await BaseService.request(
      "get",
      API_ENDPOINTS.ASSESSMENT_TYPE.GETALL
    );
    return response.data;
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
