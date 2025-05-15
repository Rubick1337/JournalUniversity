const AcademicBuildingService = require("../services/AcademicBuildingService");

class AcademicBuildingController {
  getAll = async (req, res, next) => {
    try {
      const result = await AcademicBuildingService.getAll();
      return res.status(200).json({
        data: result,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

}

module.exports = new AcademicBuildingController();
