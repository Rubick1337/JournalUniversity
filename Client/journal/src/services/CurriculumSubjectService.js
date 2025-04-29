import $api from "../http/index";
import { API_ENDPOINTS } from "../http/apiEnpoints";
import BaseService from "./BaseService";

class CurriculumSubjectService extends BaseService {
  async create(curriculumId, data = {}) {
    const endpoint = API_ENDPOINTS.CURRICULUM_SUBJECT.CREATE.replace(
      ":curriculumId",
      curriculumId
    );
    const response = await BaseService.request("post", endpoint, data);
    return response;
  }

  async update({ curriculumId, subjectId, assessmentTypeId, semester }, data) {
    const endpoint = API_ENDPOINTS.CURRICULUM_SUBJECT.UPDATE.replace(
      "curriculumId",
      curriculumId
    )
      .replace("subjectId", subjectId)
      .replace("assessmentTypeId", assessmentTypeId)
      .replace("semester", semester);

    const response = await BaseService.request("put", endpoint, data);
    return response;
  }

  async delete({ curriculumId, subjectId, assessmentTypeId, semester }) {
    const endpoint = API_ENDPOINTS.CURRICULUM_SUBJECT.DELETE.replace(
      "curriculumId",
      curriculumId
    )
      .replace("subjectId", subjectId)
      .replace("assessmentTypeId", assessmentTypeId)
      .replace("semester", semester);
    const response = await BaseService.request(
      "delete",
      endpoint
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

  async getBy({ curriculumId, subjectId, assessmentTypeId, semester }) {
    const endpoint = API_ENDPOINTS.CURRICULUM_SUBJECT.GET_BY_COMPOSITED_ID.replace(
      "curriculumId",
      curriculumId
    )
      .replace("subjectId", subjectId)
      .replace("assessmentTypeId", assessmentTypeId)
      .replace("semester", semester);

    const response = await BaseService.request(
      "get",
      endpoint
    );
    return response.data;
  }
}

export default new CurriculumSubjectService();
