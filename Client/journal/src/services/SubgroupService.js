import $api from "../http/index";
import { API_ENDPOINTS } from "../http/apiEnpoints";
import BaseService from "./BaseService";

const addParamInEndpoint = (endpoint, paramName, paramValue) => {
  if (paramValue === undefined || paramValue === null || paramValue === "") {
    return endpoint; // Не добавляем пустые параметры
  }

  const separator = endpoint.includes("?") ? "&" : "?";
  return `${endpoint}${separator}${paramName}=${encodeURIComponent(paramValue)}`;
};

class SubgroupService extends BaseService {
  async createSubgroup(data) {
    const response = await BaseService.request(
      "post",
      API_ENDPOINTS.SUBGROUP.CREATE,
      data
    );
    return response;
  }

  async updateSubgroup(id, data) {
    const response = await BaseService.request(
      "put",
      API_ENDPOINTS.SUBGROUP.UPDATE.replace(':id', id),
      data
    );
    return response;
  }

  async deleteSubgroup(id) {
    const response = await BaseService.request(
      "delete",
      API_ENDPOINTS.SUBGROUP.DELETE.replace(':id', id),
    );
    return response;
  }

  async getAllSubgroups({limit, page, sortBy, sortOrder, idQuery, nameQuery,groupQuery}) {
    let endpoint = API_ENDPOINTS.SUBGROUP.GETALL;
    console.log("Dasdasw")
    console.log(groupQuery)
    endpoint = addParamInEndpoint(endpoint, "limit", limit);
    endpoint = addParamInEndpoint(endpoint, "page", page);
    endpoint = addParamInEndpoint(endpoint, "sortBy", sortBy);
    endpoint = addParamInEndpoint(endpoint, "sortOrder", sortOrder);
    endpoint = addParamInEndpoint(endpoint, "idQuery", idQuery);
    endpoint = addParamInEndpoint(endpoint, "nameQuery", nameQuery);
    endpoint = addParamInEndpoint(endpoint, "groupQuery", groupQuery);

    const response = await BaseService.request(
        "get",
        endpoint
    );
    return response;
  }

  async getSubgroupById(id) {
    const response = await BaseService.request(
      "get",
      API_ENDPOINTS.SUBGROUP.GETBYID.replace(':id', id),
    );
    return response.data;
  }
}

export default new SubgroupService();
