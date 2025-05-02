// GroupController.js
const GroupService = require("../services/GroupService");
const GroupCreationDTO = require("../DTOs/ForCreation/GroupDataForCreateDto");
const GroupDataDto = require("../DTOs/Data/GroupFullDataDto");
const GroupUpdateDto = require("../DTOs/ForUpdate/GroupDataForUpdateDto");
const MetaDataDto = require("../DTOs/Data/MetaDataDto");
const CurriculumSubjectDto = require("../DTOs/Data/CurriculumSubjectDto");

class GroupController {
  create = async (req, res, next) => {
    try {
      const dataDto = new GroupCreationDTO(req.body);
      const result = await GroupService.create(dataDto);
      const resultDto = new GroupDataDto(result);
      return res.status(200).json({ message: "created", data: resultDto });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
  getCurrentSubjects = async (req, res, next) => {
    try {
      const groupId = req.groupId || 1;
      const currentSubjects = await GroupService.getCurrentSubjectsByGroup(
        groupId
      );

      const dataDto = currentSubjects.map((element) => {
        return new CurriculumSubjectDto(element);
      });

      return res.status(200).json({
        data: dataDto,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  getAll = async (req, res, next) => {
    try {
      const {
        limit = 10,
        page = 1,
        sortBy = "name",
        sortOrder = "ASC",
        idQuery = "",
        nameQuery = "",
        facultyQuery = "",
        departmentQuery = "",
        specialtyQuery = "",
        classRepresentativeQuery = "",
        teacherCuratorQuery = "",
      } = req.query;

      const { data, meta } = await GroupService.getAll({
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder,
        query: {
          idQuery,
          nameQuery,
          facultyQuery,
          departmentQuery,
          specialtyQuery,
          classRepresentativeQuery,
          teacherCuratorQuery,
        },
      });

      const dataDto = data.map((obj) => new GroupDataDto(obj));
      const metaDto = new MetaDataDto(meta);
      return res.status(200).json({
        data: dataDto,
        meta: metaDto,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  getById = async (req, res, next) => {
    try {
      const { groupId } = req.params;
      const data = await GroupService.getById(groupId);
      const dataDto = new GroupDataDto(data);
      return res.status(200).json({
        data: dataDto,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const { groupId } = req.params;
      const dataDto = new GroupUpdateDto(req.body);
      const result = await GroupService.update(groupId, dataDto);
      const resultDto = new GroupDataDto(result);
      return res.status(200).json({ message: "updated", data: resultDto });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { groupId } = req.params;
      const result = await GroupService.delete(groupId);
      if (!result) {
        return res
          .status(404)
          .json({ message: `Not found group by id ${groupId}` });
      }
      return res.status(204).send();
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
}

module.exports = new GroupController();
