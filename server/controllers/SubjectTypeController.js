const SubjectTypeService = require("../services/SubjectTypeService");
const SubjectTypeCreationDTO = require("../DTOs/ForCreation/SubjectTypeDtoForCreation");
const SubjectTypeDataDto = require("../DTOs/Data/SubjectTypeDto");
const SubjectTypeUpdateDto = require("../DTOs/ForUpdate/SubjectTypeDtoForUpdate");
const MetaDataDto = require("../DTOs/Data/MetaDataDto");

class SubjectTypeController {
  create = async (req, res, next) => {
    try {
      const dataDto = new SubjectTypeCreationDTO(req.body);
      const result = await SubjectTypeService.create(dataDto);
      const resultDto = new SubjectTypeDataDto(result);
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
        nameQuery = ""
      } = req.query;

      const { data, meta } = await SubjectTypeService.getAll({
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder,
        query: {
          idQuery,
          nameQuery
        },
      });
      
      const dataDto = data.map((obj) => new SubjectTypeDataDto(obj));
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
      const { subjectTypeId } = req.params;
      const data = await SubjectTypeService.getById(subjectTypeId);
      const dataDto = new SubjectTypeDataDto(data);
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
      const { subjectTypeId } = req.params;
      const dataDto = new SubjectTypeUpdateDto(req.body);
      const result = await SubjectTypeService.update(subjectTypeId, dataDto);
      const resultDto = new SubjectTypeDataDto(result);
      return res.status(200).json({ message: "updated", data: resultDto });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { subjectTypeId } = req.params;
      const result = await SubjectTypeService.delete(subjectTypeId);
      if (!result) {
        return res
          .status(404)
          .json({ message: `Not found subject type by id ${subjectTypeId}` });
      }
      return res.status(204).send();
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
}

module.exports = new SubjectTypeController();