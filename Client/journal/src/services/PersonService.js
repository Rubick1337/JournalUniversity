import $api from "../http/index";
import { API_ENDPOINTS } from "../http/apiEnpoints";
import BaseService from "./BaseService";

class PersonService extends BaseService {
  create = async (data) => {
    const endpoint = API_ENDPOINTS.PERSON.CREATE;
    const response = await BaseService.request("post", endpoint, data);
    return response;
  };
  getPersonsDataForSelect = async () => {
    const endpoint = API_ENDPOINTS.GET_PERSONS_DATA_FOR_SELECT;
    const response = await BaseService.request("get", endpoint);
    return response.data;
  };
  getAll = async (
    limit = 10,
    page = 1,
    sortBy = "surname",
    sortOrder = "ASC",
    surnameQuery = "",
    nameQuery = "",
    middlenameQuery = "",
    phoneNumberQuery = "",
    emailQuery = ""
  ) => {
    const endpoint = API_ENDPOINTS.PERSON.GETALL;

    // Создаем объект с параметрами
    const params = new URLSearchParams();

    params.append("limit", limit.toString());
    params.append("page", page.toString());
    params.append("sortBy", sortBy);
    params.append("sortOrder", sortOrder);

    if (surnameQuery) params.append("surnameQuery", surnameQuery);
    if (nameQuery) params.append("nameQuery", nameQuery);
    if (middlenameQuery) params.append("middlenameQuery", middlenameQuery);
    if (phoneNumberQuery) params.append("phoneNumberQuery", phoneNumberQuery);
    if (emailQuery) params.append("emailQuery", emailQuery);

    // Добавляем параметры к endpoint
    const urlWithParams = `${endpoint}?${params.toString()}`;

    const response = await BaseService.request("get", urlWithParams);
    return { data: response.data, meta: response.meta };
  };
  delete = async (personId) => {
    const endpoint = API_ENDPOINTS.PERSON.DELETE.replace(':personId', personId);
    const response = await BaseService.request("delete", endpoint);
    return response;
  }
}
const personServiceInstance = new PersonService();

export default personServiceInstance;
