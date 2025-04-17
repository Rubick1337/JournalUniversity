const { query } = require("../db");
const GetAcademicSpecialtiesDto = require("../DTOs/Data/GetAcademicSpecialtiesDto");
const AcademicSpecialtyCreationDto = require("../DTOs/ForCreation/AcademicSpecialtyCreationDto");
const AcademicSpecialtyService = require("../services/AcademicSpecialtyService");

class AcademicSpecialtyController {
  create = async (req, res, next) => {
    try {
      const dataForCreate = new AcademicSpecialtyCreationDto(req.body);
      const result = await AcademicSpecialtyService.create(dataForCreate);
      const resultDto = result;
      return res.status(201).json({ data: resultDto });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  getAll = async (req, res, next) => {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "code",
        sortOrder = "asc",
        codeQuery = "",
        nameQuery = "",
      } = req.query;
      //TODO валидация параметров query

      const {data, meta} = await AcademicSpecialtyService.getAll({
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder,
        query: { codeQuery, nameQuery },
      });
      const result = data.map((element) => {
        return new GetAcademicSpecialtiesDto(element);
      });
      const total = meta.total;
      return res.status(200).json({
        data: result,
        meta: {
          total: total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit)
        }
      });    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  updateAcademicSpecialties = async (req, res, next) => {
    try {
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
  deleteAcademicSpecialties = async (req, res, next) => {
    try {
      const { id } = req.params;
      const resultOfDelete =
        await AcademicSpecialtyService.deleteAcademicSpecialties(id);
      return res.status(200).json({ message: "succesfull", resultOfDelete });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
}

module.exports = new AcademicSpecialtyController();
