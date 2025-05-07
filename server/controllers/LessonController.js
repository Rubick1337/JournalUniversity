const LessonService = require("../services/LessonService");
const LessonCreationDTO = require("../DTOs/ForCreation/LessonDataForCreateDto");
const LessonDataDto = require("../DTOs/Data/LessonFullDataDto");
const LessonUpdateDto = require("../DTOs/ForUpdate/LessonDataForUpdateDto");
const MetaDataDto = require("../DTOs/Data/MetaDataDto");

class LessonController {
  create = async (req, res, next) => {
    try {
      const dataDto = new LessonCreationDTO(req.body);
      const result = await LessonService.create(dataDto);
      const resultDto = new LessonDataDto(result);
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
        sortBy = "date",
        sortOrder = "ASC",
        idQuery = "",
        groupQuery = "",
        subgroupQuery = "",
        subjectQuery = "",
        teacherQuery = "",
        topicQuery = "",
        audienceQuery = "",
        subjectTypeQuery = "",
        dateFrom = "",
        dateTo = ""
      } = req.query;

      const { data, meta } = await LessonService.getAll({
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder,
        query: {
          idQuery,
          groupQuery,
          subgroupQuery,
          subjectQuery,
          teacherQuery,
          topicQuery,
          audienceQuery,
          subjectTypeQuery,
          dateFrom,
          dateTo
        },
      });
      
      const dataDto = data.map((obj) => new LessonDataDto(obj));
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
      const { lessonId } = req.params;
      const data = await LessonService.getById(lessonId);
      const dataDto = new LessonDataDto(data);
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
      const { lessonId } = req.params;
      const dataDto = new LessonUpdateDto(req.body);
      const result = await LessonService.update(lessonId, dataDto);
      const resultDto = new LessonDataDto(result);
      return res.status(200).json({ message: "updated", data: resultDto });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { lessonId } = req.params;
      const result = await LessonService.delete(lessonId);
      if (!result) {
        return res
          .status(404)
          .json({ message: `Not found lesson by id ${lessonId}` });
      }
      return res.status(204).send();
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
}

module.exports = new LessonController();