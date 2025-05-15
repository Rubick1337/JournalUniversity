// GroupController.js
const GradeService = require("../services/GradeService");

class GradeController {
  create = async (req, res, next) => {
    try {
      const result = await GradeService.create(req.body);
      return res.status(200).json({ message: "created", data: result });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

}

module.exports = new GradeController();
