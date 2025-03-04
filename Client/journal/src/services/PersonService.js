import $api from "../http/index";
import { API_ENDPOINTS } from "../http/apiEnpoints";
import BaseService from "./BaseService";

class PersonService extends BaseService {
    createPerson = async (data) => {
        const endpoint = API_ENDPOINTS.CREATE_PERSON;
        const response = await BaseService.request("post", endpoint,data);
        return response;
    }
    getPersonsDataForSelect = async() => {
        const endpoint = API_ENDPOINTS.GET_PERSONS_DATA_FOR_SELECT;
        const response = await BaseService.request("get", endpoint);
        return response.data;
    }
}
const personServiceInstance = new PersonService();

export default personServiceInstance;
