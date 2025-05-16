import { API_ENDPOINTS } from "../http/apiEnpoints";
import BaseService from "./BaseService";

// Вспомогательная функция для добавления параметров в URL
const addParamInEndpoint = (endpoint, paramName, paramValue) => {
    if (paramValue === undefined || paramValue === null || paramValue === "") {
        return endpoint;
    }

    const separator = endpoint.includes("?") ? "&" : "?";
    return `${endpoint}${separator}${paramName}=${encodeURIComponent(paramValue)}`;
};

class StudyPlanService extends BaseService {
    async getTopicsProgressForSubject(studentId, subjectId) {
        let endpoint = API_ENDPOINTS.STUDY_PLAN.GET_TOPICS_PROGRESS;

        endpoint = addParamInEndpoint(endpoint, "studentId", studentId);
        endpoint = addParamInEndpoint(endpoint, "subjectId", subjectId);

        const response = await BaseService.request("get", endpoint);
        return response.data;
    }

    async getLabsStatsForStudent(studentId, subjectId) {
        let endpoint = API_ENDPOINTS.STUDY_PLAN.GET_LABS_STATS;

        endpoint = addParamInEndpoint(endpoint, "studentId", studentId);
        endpoint = addParamInEndpoint(endpoint, "subjectId", subjectId);

        const response = await BaseService.request("get", endpoint);
        return response.data;
    }
}

export default new StudyPlanService();
