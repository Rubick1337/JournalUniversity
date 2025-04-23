const CurriculumService = require("../services/CurriculumService");
const CurriculumCreationDTO = require("../DTOs/ForCreation/CurriculumDtoForCreation");
const CurriculumDataDto = require("../DTOs/Data/CurriculumDto");
const CurriculumUpdateDto = require("../DTOs/ForUpdate/CurriculumDtoForUpdate");
const MetaDataDto = require("../DTOs/Data/MetaDataDto");

class CurriculumController {
  create = async (req, res, next) => {
    try {
      const dataDto = new CurriculumCreationDTO(req.body);
      const result = await CurriculumService.create(dataDto);
      const resultDto = new CurriculumDataDto(result);
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
        sortBy = "year_of_specialty_training",
        sortOrder = "ASC",
        idQuery = "",
        yearQuery = "",
        specialtyQuery = "",
        educationFormQuery = ""
      } = req.query;

      const { data, meta } = await CurriculumService.getAll({
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder,
        query: {
          idQuery,
          yearQuery,
          specialtyQuery,
          educationFormQuery
        },
      });
      
      const dataDto = data.map((obj) => new CurriculumDataDto(obj));
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
      const data = await CurriculumService.getById(id);
      const dataDto = new CurriculumDataDto(data);
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
      const dataDto = new CurriculumUpdateDto(req.body);
      const result = await CurriculumService.update(id, dataDto);
      const resultDto = new CurriculumDataDto(result);
      return res.status(200).json({ message: "updated", data: resultDto });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await CurriculumService.delete(id);
      if (!result) {
        return res
          .status(404)
          .json({ message: `Not found curriculum by id ${id}` });
      }
      return res.status(204).send();
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
}

module.exports = new CurriculumController();