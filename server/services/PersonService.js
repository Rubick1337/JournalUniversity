const ApiError = require("../error/ApiError");
const { Person } = require("../models/index");
const { dbQuery } = require("../dbUtils");
const QUERIES = require("../queries/queries");
class PersonService {
  createPerson = async (data) => {
    const result = await Person.create(data);
    return result;
  };

  getDataForSelect = async () => {
    const params = [];
    const data = await dbQuery(QUERIES.GET_PEOPLE_DATA_FOR_SELECT, params);
    const extractedData = Object.values(data[0])[0];
    return extractedData;
  };
}

module.exports = new PersonService();
