import $api from "../http/index";
import { API_ENDPOINTS } from "../http/apiEnpoints";
import BaseService from "./BaseService";

class ScheduleService extends BaseService {
    async getScheduleForStudent(studentId, date = null, weekdayNumber = null, weekType = null) {
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