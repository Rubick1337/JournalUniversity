const ApiError = require("../error/ApiError");
const { AcademicBuilding, Op, Sequelize } = require("../models/index");

class AcademicBuildingService {
  async getAll() {
    try {
      const result = await AcademicBuilding.findAll({
        order: [["name", "ASC"]], 
      });
      return result;
    } catch (err) {
      throw err;
    }
  }
}
module.exports = new AcademicBuildingService();
