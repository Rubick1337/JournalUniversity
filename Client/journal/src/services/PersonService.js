import $api from "../http/index";
import { API_ENDPOINTS } from "../http/apiEnpoints";
import BaseService from "./BaseService";

class PersonService extends BaseService {
    createPerson = async (data) => {
        console.log("data",data)
        alert("TEST")
        const endpoint = API_ENDPOINTS.CREATE_PERSON;
        const response = await BaseService.request("post", endpoint,data);
        return response;
    }
}
const personServiceInstance = new PersonService();

export default personServiceInstance;
