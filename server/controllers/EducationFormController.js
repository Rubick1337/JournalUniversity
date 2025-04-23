// EducationFormController.js
const EducationFormService = require("../services/EducationFormService");
const EducationFormCreationDTO = require("../DTOs/ForCreation/EducationFormDtoForCreation");
const EducationFormDataDto = require("../DTOs/Data/EducationFormDto");
const EducationFormUpdateDto = require("../DTOs/ForUpdate/EducationFormDtoForUpdate");
const MetaDataDto = require("../DTOs/Data/MetaDataDto");

class EducationFormController {
  create = async (req, res, next) => {
    try {
      const dataDto = new EducationFormCreationDTO(req.body);
      const result = await EducationFormService.create(dataDto);
      const resultDto = new EducationFormDataDto(result);
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

      const { data, meta } = await EducationFormService.getAll({
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder,
        query: {
          idQuery,
          nameQuery
        },
      });
      
      const dataDto = data.map((obj) => new EducationFormDataDto(obj));
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
      const data = await EducationFormService.getById(id);
      const dataDto = new EducationFormDataDto(data);
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
      const dataDto = new EducationFormUpdateDto(req.body);
      const result = await EducationFormService.update(id, dataDto);
      const resultDto = new EducationFormDataDto(result);
      return res.status(200).json({ message: "updated", data: resultDto });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await EducationFormService.delete(id);
      if (!result) {
        return res
          .status(404)
          .json({ message: `Not found education form by id ${id}` });
      }
      return res.status(204).send();
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
}

module.exports = new EducationFormController();
