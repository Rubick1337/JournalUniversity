const ApiError = require("../error/ApiError");
const { Group } = require("../models/index");
const { dbQuery } = require("../dbUtils");
const QUERIES = require("../queries/queries");
class GroupService {
    getSubgroupsByGroupId = async (groupId) => {
    const params = [groupId];
    const data = await dbQuery(QUERIES.GET_SUBGROUPS_BY_GROUP_ID, params);
    const extractedData = Object.values(data[0])[0];
    return extractedData;
  };
  getGroupName = async (groupId) => {
    const params = [groupId];
    const data = await dbQuery(QUERIES.GET_GROUP_NAME, params);
    const extractedData = Object.values(data[0])[0];
    return extractedData;
  };
  
}

module.exports = new GroupService();
