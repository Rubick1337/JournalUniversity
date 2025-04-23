const AcademicSpecialtyService = require("../services/AcademicSpecialtyService");
const AcademicSpecialtyCreationDTO = require("../DTOs/ForCreation/AcademicSpecialtyDtoForCreation");
const AcademicSpecialtyDataDto = require("../DTOs/Data/AcademicSpecialtiesDto");
const AcademicSpecialtyUpdateDto = require("../DTOs/ForUpdate/AcademicSpecialtyDtoForUpdate");
const MetaDataDto = require("../DTOs/Data/MetaDataDto");

class AcademicSpecialtyController {
  create = async (req, res, next) => {
    try {
      const dataDto = new AcademicSpecialtyCreationDTO(req.body);
      const result = await AcademicSpecialtyService.create(dataDto);
      const resultDto = new AcademicSpecialtyDataDto(result);
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
        sortBy = "code",
        sortOrder = "ASC",
        codeQuery = "",
        nameQuery = ""
      } = req.query;

      const { data, meta } = await AcademicSpecialtyService.getAll({
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder,
        query: {
          codeQuery,
          nameQuery
        },
      });
      
      const dataDto = data.map((obj) => new AcademicSpecialtyDataDto(obj));
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

  getByCode = async (req, res, next) => {
    try {
      const { code } = req.params;
      const data = await AcademicSpecialtyService.getByCode(code);
      const dataDto = new AcademicSpecialtyDataDto(data);
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
      const { code } = req.params;
      const dataDto = new AcademicSpecialtyUpdateDto(req.body);
      const result = await AcademicSpecialtyService.update(code, dataDto);
      const resultDto = new AcademicSpecialtyDataDto(result);
      return res.status(200).json({ message: "updated", data: resultDto });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { code } = req.params;
      const result = await AcademicSpecialtyService.delete(code);
      if (!result) {
        return res
          .status(404)
          .json({ message: `Not found academic specialty by code ${code}` });
      }
      return res.status(204).send();
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
}

module.exports = new AcademicSpecialtyController();