import $api from "../http/index";
import { API_ENDPOINTS } from "../http/apiEnpoints";
import BaseService from "./BaseService";

class AcademicBuildingService extends BaseService {

  async getAll() {
    const endpoint = API_ENDPOINTS.ACADEMIC_BUILDING.GETALL;

    const params = new URLSearchParams();
    // params.append("date", date);
    const url = `${endpoint}?${params.toString()}`;
    const response = await BaseService.request("get", url);
    return response;
  }

}

export default new AcademicBuildingService();
