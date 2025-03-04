const ApiError = require("../error/ApiError");
const { Person } = require("../models/index");

class PersonService {
 createPerson = async(data) => {
    const result = await Person.create(data);
    return result;
 } 
}

module.exports = new PersonService();
