import $api from "../http/index";
import { API_ENDPOINTS } from "../http/apiEnpoints";
import BaseService from "./BaseService";

class DepartmentService extends BaseService {
  async createDepartment(data) {
    const response = await BaseService.request(
      "post",
      API_ENDPOINTS.DEPARTMENT.CREATE,
      data
    );
    return response;
  }

  async updateDepartment(id, data) {
    const response = await BaseService.request(
      "put",
      API_ENDPOINTS.DEPARTMENT.UPDATE.replace(':departmentId', id),
      data
    );
    return response;
  }

  async deleteDepartment(id) {
    const response = await BaseService.request(
      "delete",
      API_ENDPOINTS.DEPARTMENT.DELETE.replace(':departmentId', id),
    );
    return response;
  }

  async getAllDepartments() {
    //TODO query params
    const response = await BaseService.request(
      "get",
      API_ENDPOINTS.DEPARTMENT.GETALL
    );
    return response.data;
  }

  async getDepartmentById(id) {
    const response = await BaseService.request(
      "get",
      API_ENDPOINTS.DEPARTMENT.GETBYID.replace(':departmentId', id),
    );
    return response.data;
  }
}

export default new DepartmentService();
