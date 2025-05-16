import $api from "../http/index";
import { API_ENDPOINTS } from "../http/apiEnpoints";
import BaseService from "./BaseService";

class PersonService extends BaseService {
  create = async (data) => {
    const endpoint = API_ENDPOINTS.PERSON.CREATE;
    const response = await BaseService.request("post", endpoint, data);
    return response;
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

    if (surnameQuery && surnameQuery !== "") {
      console.log("Добавляем surnameQuery:", surnameQuery); // Логируем
      params.append("surnameQuery", surnameQuery);
    }
    if (nameQuery && nameQuery !== "") {
      console.log("Добавляем nameQuery:", nameQuery); // Логируем
      params.append("nameQuery", nameQuery);
    }
    if (middlenameQuery && middlenameQuery !== "") {
      console.log("Добавляем middlenameQuery:", middlenameQuery); // Логируем
      params.append("middlenameQuery", middlenameQuery);
    }
    if (phoneNumberQuery && phoneNumberQuery !== "") {
      console.log("Добавляем phoneNumberQuery:", phoneNumberQuery); // Логируем
      params.append("phoneNumberQuery", phoneNumberQuery);
    }
    if (emailQuery && emailQuery !== "") {
      console.log("Добавляем emailQuery:", emailQuery); // Логируем
      params.append("emailQuery", emailQuery);
    }

    // Логируем строку запроса
    console.log("Сформированные параметры для запроса:", params.toString());

    // Добавляем параметры к endpoint
    const urlWithParams = `${endpoint}?${params.toString()}`;
    console.log("Финальный URL с параметрами:", urlWithParams);

    const response = await BaseService.request("get", urlWithParams);

    // Логируем полученный ответ
    console.log("Ответ от API:", response);

    return { data: response.data, meta: response.meta };
  };

  getAllByFullName = async ({
    limit = 10,
    page = 1,
    sortBy = "surname",
    sortOrder = "ASC",
    fullNameQuery = "",
  }) => {

    const endpoint = API_ENDPOINTS.PERSON.GET_ALL_BY_FULL_NAME;

    // Создаем объект с параметрами
    const params = new URLSearchParams();

    params.append("limit", limit.toString());
    params.append("page", page.toString());
    params.append("sortBy", sortBy.toString());
    params.append("sortOrder", sortOrder.toString());

    if (fullNameQuery && fullNameQuery !== "") {
      console.log("Добавляем fullNameQuery:", fullNameQuery);
      params.append("fullNameQuery", fullNameQuery);
    }

    // Логируем строку запроса
    console.log("Сформированные параметры для запроса:", params.toString());

    // Добавляем параметры к endpoint
    const urlWithParams = `${endpoint}?${params.toString()}`;
    console.log("Финальный URL с параметрами:", urlWithParams);

    const response = await BaseService.request("get", urlWithParams);

    // Логируем полученный ответ
    console.log("Ответ от API:", response);

    return { data: response.data, meta: response.meta };
  };

  update = async (personId, data) => {
    const endpoint = API_ENDPOINTS.PERSON.UPDATE.replace(":personId", personId);
    const response = await BaseService.request("put", endpoint, data);
    return response;
  };
  delete = async (personId) => {
    const endpoint = API_ENDPOINTS.PERSON.DELETE.replace(":personId", personId);
    const response = await BaseService.request("delete", endpoint);
    return response;
  };
}
const personServiceInstance = new PersonService();

export default personServiceInstance;
