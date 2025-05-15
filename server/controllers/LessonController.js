const LessonService = require("../services/LessonService");

class LessonController {
  create = async (req, res, next) => {
    try {
      const result = await LessonService.create(req.body);
      return res.status(200).json({ message: "created", data: result });
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
        dateTo = "",
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
          dateTo,
        },
      });

      return res.status(200).json({
        data: data,
        meta: meta,
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
      return res.status(200).json({
        data: data,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const { lessonId } = req.params;
      const result = await LessonService.update(lessonId, req.body);
      return res.status(200).json({ message: "updated", data: result });
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

  getPairsOnDate = async (req, res, next) => {
    try {
      const date = req.query.date || null;
      const result = await LessonService.getPairsOnDate(date);
      return res.status(200).json({
        data: result,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
}

module.exports = new LessonController();
