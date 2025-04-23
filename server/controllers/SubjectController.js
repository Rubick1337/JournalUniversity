const SubjectService = require("../services/SubjectService");
const SubjectCreationDTO = require("../DTOs/ForCreation/SubjecDtoForCreate");
const SubjectDataDto = require("../DTOs/Data/Subject/SubjectFullDataDto");
const SubjectUpdateDto = require("../DTOs/ForUpdate/SubjecDtoForUpdate");
const MetaDataDto = require("../DTOs/Data/MetaDataDto");

class SubjectController {
  create = async (req, res, next) => {
    try {
      const dataDto = new SubjectCreationDTO(req.body);
      const result = await SubjectService.create(dataDto);
      const resultDto = new SubjectDataDto(result);
      return res.status(200).json({ message: "created", data: resultDto });
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
        departmentQuery = ""
      } = req.query;

      const { data, meta } = await SubjectService.getAll({
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder,
        query: {
          idQuery,
          nameQuery,
          departmentQuery
        },
      });
      
      const dataDto = data.map((obj) => new SubjectDataDto(obj));
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
      const { subjectId } = req.params;
      const data = await SubjectService.getById(subjectId);
      const dataDto = new SubjectDataDto(data);
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
      const { subjectId } = req.params;
      const dataDto = new SubjectUpdateDto(req.body);
      const result = await SubjectService.update(subjectId, dataDto);
      const resultDto = new SubjectDataDto(result);
      return res.status(200).json({ message: "updated", data: resultDto });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { subjectId } = req.params;
      const result = await SubjectService.delete(subjectId);
      if (!result) {
        return res
          .status(404)
          .json({ message: `Not found subject by id ${subjectId}` });
      }
      return res.status(204).send();
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
}

module.exports = new SubjectController();