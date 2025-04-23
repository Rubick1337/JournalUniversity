import $api from "../http/index";
import { API_ENDPOINTS } from "../http/apiEnpoints";
import BaseService from "./BaseService";

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

  async getAllTeacherPositions() {
    //TODO query params
    const response = await BaseService.request(
      "get",
      API_ENDPOINTS.TEACHER_POSITION.GETALL
    );
    return response.data;
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
