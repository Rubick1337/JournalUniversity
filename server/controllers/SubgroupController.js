const StudentFIOData = require("../DTOs/Data/StudentFIOData");
const SubgroupService = require("../services/SubgroupService");

class SubgroupController {
  getStudentsFIOBySubgroupId = async (req, res, next) => {
    try {
      const { subgroupId } = req.query;
      const result = await SubgroupService.getStudentsFIOBySubgroupId(subgroupId);
      const resultDto = result.map((element) => {
        return new StudentFIOData(element);
      });
      console.log(resultDto);
      return res.status(200).json({ data: resultDto });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
}

module.exports = new SubgroupController();
