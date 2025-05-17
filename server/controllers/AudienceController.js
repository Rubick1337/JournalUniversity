const AudienceService = require("../services/AudienceService");

class AudienceController {
  getAll = async (req, res, next) => {
    try {
      const numberAudienceQuery = req.query.numberAudienceQuery ?? null;
      const academicBuildingIdQuery = req.query.academicBuildingIdQuery ?? null;
      const result = await AudienceService.getAll(
        numberAudienceQuery,
        academicBuildingIdQuery
      );
      return res.status(200).json({
        data: result,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
  create = async (req, res, next) => {
    try {
      const data = req.body;
      const result = await AudienceService.create(data);
      return res.status(200).json({
        data: result,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
}

module.exports = new AudienceController();
