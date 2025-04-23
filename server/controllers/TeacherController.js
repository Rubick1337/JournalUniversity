const TeacherService = require("../services/TeacherService");
const TeacherCreationDTO = require("../DTOs/ForCreation/TeacherDtoForCreation");
const TeacherDataDto = require("../DTOs/Data/TeacherDto");
const TeacherUpdateDto = require("../DTOs/ForUpdate/TeacherDtoForUpdate");
const MetaDataDto = require("../DTOs/Data/MetaDataDto");

class TeacherController {
  create = async (req, res, next) => {
    try {
      const dataDto = new TeacherCreationDTO(req.body);
      const result = await TeacherService.create(dataDto);
      const resultDto = new TeacherDataDto(result);
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
        sortBy = "id",
        sortOrder = "ASC",
        idQuery = "",
        personQuery = "",
        departmentQuery = "",
        positionQuery = ""
      } = req.query;

      const { data, meta } = await TeacherService.getAll({
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder,
        query: {
          idQuery,
          personQuery,
          departmentQuery,
          positionQuery
        },
      });
      
      const dataDto = data.map((obj) => new TeacherDataDto(obj));
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
      const { teacherId } = req.params;
      const data = await TeacherService.getById(teacherId);
      const dataDto = new TeacherDataDto(data);
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
      const { teacherId } = req.params;
      const dataDto = new TeacherUpdateDto(req.body);
      const result = await TeacherService.update(teacherId, dataDto);
      const resultDto = new TeacherDataDto(result);
      return res.status(200).json({ message: "updated", data: resultDto });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { teacherId } = req.params;
      const result = await TeacherService.delete(teacherId);
      if (!result) {
        return res
          .status(404)
          .json({ message: `Not found teacher by id ${teacherId}` });
      }
      return res.status(204).send();
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
}

module.exports = new TeacherController();