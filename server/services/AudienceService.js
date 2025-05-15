const ApiError = require("../error/ApiError");
const {
  Audience,
  AcademicBuilding,
  Op,
  Sequelize,
} = require("../models/index");

class AudienceService {
  async getAll(numberAudienceQuery, academicBuildingIdQuery) {
    try {
      const whereCondition = {};

      // Если задан ID корпуса, добавляем условие
      if (academicBuildingIdQuery) {
        whereCondition.academic_building_id = academicBuildingIdQuery;
      }
      // Если задан поиск по номеру аудитории

      

      if (numberAudienceQuery) {
        whereCondition[Op.and] = [
          Sequelize.where(
            Sequelize.cast(Sequelize.col("Audience.number"), "TEXT"),
            {
              [Op.iLike]: `%${numberAudienceQuery}%`,
            }
          ),
        ];
      }

      const result = await Audience.findAll({
        where: whereCondition,
      });
      return result;
    } catch (err) {
      throw err;
    }
  }
}
module.exports = new AudienceService();
