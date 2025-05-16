const StudentService = require("../services/StudentService");
const StudentCreationDTO = require("../DTOs/ForCreation/StudentDataForCreateDto");
const StudentFullDataDto = require("../DTOs/Data/StudentFullDataDto");
const StudentUpdateDto = require("../DTOs/ForUpdate/StudentDataForUpdateDto");
const MetaDataDto = require("../DTOs/Data/MetaDataDto");

class StudentController {
  create = async (req, res, next) => {
    try {
      const dataDto = new StudentCreationDTO(req.body);
      const result = await StudentService.create(dataDto);
      const resultDto = new StudentFullDataDto(result);
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
        sortBy = "person.surname",
        sortOrder = "ASC",
        idQuery = "",
        surnameQuery = "",
        nameQuery = "",
        groupQuery = "",
        subgroupQuery = "",
        parentQuery = "",
        reprimandQuery = "",
        groupIdQuery = "",
        subgroupIdQuery = "",
      } = req.query;

      const { data, meta } = await StudentService.getAll({
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder,
        query: {
          idQuery,
          surnameQuery,
          nameQuery,
          groupQuery,
          subgroupQuery,
          parentQuery,
          reprimandQuery,
          groupIdQuery,
          subgroupIdQuery,
        },
      });

      const dataDto = data.map((obj) => new StudentFullDataDto(obj));
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
      const { studentId } = req.params;
      const data = await StudentService.getById(studentId);
      const dataDto = new StudentFullDataDto(data);
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
      const { studentId } = req.params;
      const dataDto = new StudentUpdateDto(req.body);
      const result = await StudentService.update(studentId, dataDto);
      const resultDto = new StudentFullDataDto(result);
      return res.status(200).json({ message: "updated", data: resultDto });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { studentId } = req.params;
      const result = await StudentService.delete(studentId);
      if (!result) {
        return res
          .status(404)
          .json({ message: `Not found student by id ${studentId}` });
      }
      return res.status(204).send();
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
}

module.exports = new StudentController();
