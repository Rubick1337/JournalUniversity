const AssessmentTypeService = require("../services/AssessmentTypeService");
const AssessmentTypeCreationDTO = require("../DTOs/ForCreation/AssessmentTypeDtoForCreation");
const AssessmentTypeDataDto = require("../DTOs/Data/AssessmentTypeDto");
const AssessmentTypeUpdateDto = require("../DTOs/ForUpdate/AssessmentTypeDtoForUpdate");
const MetaDataDto = require("../DTOs/Data/MetaDataDto");

class AssessmentTypeController {
  create = async (req, res, next) => {
    try {
      const dataDto = new AssessmentTypeCreationDTO(req.body);
      const result = await AssessmentTypeService.create(dataDto);
      const resultDto = new AssessmentTypeDataDto(result);
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

      const { data, meta } = await AssessmentTypeService.getAll({
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder,
        query: {
          idQuery,
          nameQuery
        },
      });
      
      const dataDto = data.map((obj) => new AssessmentTypeDataDto(obj));
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
      const { id } = req.params;
      const data = await AssessmentTypeService.getById(id);
      const dataDto = new AssessmentTypeDataDto(data);
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
      const { id } = req.params;
      const dataDto = new AssessmentTypeUpdateDto(req.body);
      const result = await AssessmentTypeService.update(id, dataDto);
      const resultDto = new AssessmentTypeDataDto(result);
      return res.status(200).json({ message: "updated", data: resultDto });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await AssessmentTypeService.delete(id);
      if (!result) {
        return res
          .status(404)
          .json({ message: `Not found assessment type by id ${id}` });
      }
      return res.status(204).send();
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
}

module.exports = new AssessmentTypeController();