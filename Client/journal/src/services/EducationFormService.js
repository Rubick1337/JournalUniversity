import $api from "../http/index";
import { API_ENDPOINTS } from "../http/apiEnpoints";
import BaseService from "./BaseService";

class EducationFormService extends BaseService {
  async create(data) {
    const response = await BaseService.request(
      "post",
      API_ENDPOINTS.EDUCATION_FORM.CREATE,
      data
    );
    return response;
  }

  async update(id, data) {
    const response = await BaseService.request(
      "put",
      API_ENDPOINTS.EDUCATION_FORM.UPDATE.replace(':id', id),
      data
    );
    return response;
  }

  async delete(id) {
    const response = await BaseService.request(
      "delete",
      API_ENDPOINTS.EDUCATION_FORM.DELETE.replace(':id', id),
    );
    return response;
  }

  async getAlls() {
    //TODO query params
    const response = await BaseService.request(
      "get",
      API_ENDPOINTS.EDUCATION_FORM.GETALL
    );
    return response.data;
  }

  async getById(id) {
    const response = await BaseService.request(
      "get",
      API_ENDPOINTS.EDUCATION_FORM.GETBYID.replace(':id', id),
    );
    return response.data;
  }
}

export default new EducationFormService();
