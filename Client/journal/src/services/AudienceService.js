import $api from "../http/index";
import { API_ENDPOINTS } from "../http/apiEnpoints";
import BaseService from "./BaseService";

class AudienceService extends BaseService {
  async getAll(numberAudienceQuery = null, academicBuildingIdQuery = null) {
    const endpoint = API_ENDPOINTS.AUDIENCE.GETALL;

    const params = new URLSearchParams();
    if (numberAudienceQuery) {
      params.append("numberAudienceQuery", numberAudienceQuery);
    }
    if (academicBuildingIdQuery) {
      params.append("academicBuildingIdQuery", academicBuildingIdQuery);
    }
    const url = `${endpoint}?${params.toString()}`;

    const response = await BaseService.request("get", url);

    return response;
  }
}

export default new AudienceService();
