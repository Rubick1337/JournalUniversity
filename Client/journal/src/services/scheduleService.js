import $api from "../http/index";
import { API_ENDPOINTS } from "../http/apiEnpoints";
import BaseService from "./BaseService";
const ID_FIELD_NAME = "scheduleId";
class ScheduleService extends BaseService {
  async getAll(paramsData = {}) {
    const endpoint = API_ENDPOINTS.SCHEDULE.GETALL;

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
    if (paramsData.dateQuery) {
      params.append("dateQuery", paramsData.dateQuery);
    }
    if (paramsData.typeOfSemesterNameQuery) {
      params.append(
        "typeOfSemesterNameQuery",
        paramsData.typeOfSemesterNameQuery
      );
    }
    if (paramsData.typeOfSemesterIdQuery) {
      params.append("typeOfSemesterIdQuery", paramsData.typeOfSemesterIdQuery);
    }
    const url = `${endpoint}?${params.toString()}`;
    const response = await BaseService.request("get", url);
    return response;
  }

  async create(data) {
    const response = await BaseService.request(
      "post",
      API_ENDPOINTS.SCHEDULE.CREATE,
      data
    );
    return response;
  }

  async update(id, data) {
    const response = await BaseService.request(
      "put",
      API_ENDPOINTS.SCHEDULE.UPDATE.replace(`:${ID_FIELD_NAME}`, id),
      data
    );
    return response;
  }
  async getById(id) {
    const response = await BaseService.request(
      "get",
      API_ENDPOINTS.SCHEDULE.GETBYID.replace(`:${ID_FIELD_NAME}`, id)
    );
    return response;
  }
  async delete(id) {
    const response = await BaseService.request(
      "delete",
      API_ENDPOINTS.SCHEDULE.DELETE.replace(`:${ID_FIELD_NAME}`, id)
    );
    return response;
  }

  async getScheduleForStudent(
    studentId,
    date = null,
    weekdayNumber = null,
    weekType = null
  ) {
    const params = {
      studentId,
      ...(date && { date }),
      ...(weekdayNumber && { weekdayNumber }),
      ...(weekType && { weekType }),
    };

    const response = await BaseService.request(
      "get",
      API_ENDPOINTS.SCHEDULE.GET_FOR_STUDENT,
      { params }
    );
    return response.data;
  }
  async getScheduleForTeacher(
    studentId,
    date = null,
    weekdayNumber = null,
    weekType = null
  ) {
    const params = {
      studentId,
      ...(date && { date }),
      ...(weekdayNumber && { weekdayNumber }),
      ...(weekType && { weekType }),
    };

    const response = await BaseService.request(
      "get",
      API_ENDPOINTS.SCHEDULE.GET_FOR_TEACHER,
      { params }
    );
    return response.data;
  }
  async getLessonsForStudent({ studentId, date }) {
    const endpoint = API_ENDPOINTS.SCHEDULE.GET_LESSONS_FOR_STUDENT;
    const params = new URLSearchParams();
    params.append("studentId", studentId);
    params.append("date", date);
    const url = `${endpoint}?${params.toString()}`;
    const response = await BaseService.request("get", url);
    console.log("url",url)
    console.log("response",response)
    return response;
  }
  async getSemesterByDate(date = null) {
    const params = date ? { date } : {};
    const response = await BaseService.request(
      "get",
      API_ENDPOINTS.SCHEDULE.GET_SEMESTER_BY_DATE,
      { params }
    );
    return response.data;
  }

  async getScheduleByDate(date = null) {
    const params = date ? { date } : {};
    const response = await BaseService.request(
      "get",
      API_ENDPOINTS.SCHEDULE.GET_SCHEDULE_BY_DATE,
      { params }
    );
    return response.data;
  }
}

export default new ScheduleService();
