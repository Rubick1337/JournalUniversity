const GroupNameData = require("../DTOs/Data/GroupNameData");
const StudentFIOData = require("../DTOs/Data/StudentFIOData");
const SubgroupNameData = require("../DTOs/Data/SubgroupNameData");
const GroupService = require("../services/GroupService");

class GroupController {
    getSubgroupsByGroupId = async (req, res, next) => {
    try {
      const { groupId } = req.query;
      const result = await GroupService.getSubgroupsByGroupId(groupId);

      const resultDto = result.map((element) => {
        return new SubgroupNameData(element);
      });
      return res.status(200).json({ data: resultDto });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
  getGroupName = async (req, res, next) => {
    try {
      const { groupId } = req.query;
      const result = await GroupService.getGroupName(groupId);

      const resultDto =  new GroupNameData(result);
      return res.status(200).json({ data: resultDto });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
  
}

module.exports = new GroupController();
