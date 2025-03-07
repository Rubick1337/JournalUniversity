const ApiError = require("../error/ApiError");
const { Subgroup } = require("../models/index");
const { dbQuery } = require("../dbUtils");
const QUERIES = require("../queries/queries");
class SubgroupService {
    getStudentsFIOBySubgroupId = async (subgroupId) => {
    const params = [subgroupId];
    const data = await dbQuery(QUERIES.GET_STUDENTS_FULL_NAME_BY_SUBGROUP_ID, params);
    const extractedData = Object.values(data[0])[0];
    return extractedData;
  };
}

module.exports = new SubgroupService();
