const ApiError = require("../error/ApiError");
const { Faculty } = require("../models/index");
const { dbQuery } = require("../dbUtils");
const QUERIES = require("../queries/queries");
class FacultyServer {
    getAll = async ()=> {
        try {
            const params = [];
            const data = await dbQuery(QUERIES.FACULTY.GET_ALL_FACULTY_WITH_FULL_DATA, params);
            const extractedData = Object.values(data[0])[0];
            return extractedData;
        }
        catch (err) {
            throw(err)
        }
    }
  
}

module.exports = new FacultyServer();
