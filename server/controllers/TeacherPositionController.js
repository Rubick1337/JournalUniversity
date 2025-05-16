const TeacherPositionService = require("../services/TeacherPositionService");
const TeacherPositionCreationDTO = require("../DTOs/ForCreation/TeacherPositionDtoForCreation");
const TeacherPositionDataDto = require("../DTOs/Data/TeacherPositionDto");
const TeacherPositionUpdateDto = require("../DTOs/ForUpdate/TeacherPositionDtoForUpdate");
const MetaDataDto = require("../DTOs/Data/MetaDataDto");

class TeacherPositionController {
  create = async (req, res, next) => {
    try {
      const dataDto = new TeacherPositionCreationDTO(req.body);
      const result = await TeacherPositionService.create(dataDto);
      const resultDto = new TeacherPositionDataDto(result);
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

      const { data, meta } = await TeacherPositionService.getAll({
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder,
        query: {
          idQuery,
          nameQuery
        },
      });
      
      const dataDto = data.map((obj) => new TeacherPositionDataDto(obj));
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
      const { teacherPositionId } = req.params;
      const data = await TeacherPositionService.getById(teacherPositionId);
      const dataDto = new TeacherPositionDataDto(data);
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
      const { teacherPositionId } = req.params;
      const dataDto = new TeacherPositionUpdateDto(req.body);
      const result = await TeacherPositionService.update(teacherPositionId, dataDto);
      const resultDto = new TeacherPositionDataDto(result);
      return res.status(200).json({ message: "updated", data: resultDto });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { teacherPositionId } = req.params;
      const result = await TeacherPositionService.delete(teacherPositionId);
      if (!result) {
        return res
          .status(404)
          .json({ message: `Not found teacher position by id ${teacherPositionId}` });
      }
      return res.status(204).send();
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
}

module.exports = new TeacherPositionController();