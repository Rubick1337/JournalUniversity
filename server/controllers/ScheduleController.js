const ScheduleService = require("../services/ScheduleService");

class ScheduleController {
  create = async (req, res, next) => {
    try {
      const result = await ScheduleService.create(req.body);
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
        sortBy = "name",
        sortOrder = "ASC",
        idQuery = "",
        nameQuery = "",
        dateQuery = "",
        typeOfSemesterIdQuery = "",
        typeOfSemesterNameQuery = "",
      } = req.query;

      const { data, meta } = await ScheduleService.getAll({
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder,
        query: {
          idQuery,
          nameQuery,
          dateQuery,
          typeOfSemesterIdQuery,
          typeOfSemesterNameQuery,
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
      const { scheduleId } = req.params;
      const data = await ScheduleService.getById(scheduleId);
      return res.status(200).json({
        data,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const { scheduleId } = req.params;
      const result = await ScheduleService.update(scheduleId, req.body);
      return res.status(200).json({ message: "updated", data: result });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { scheduleId } = req.params;
      const result = await ScheduleService.delete(scheduleId);
      if (!result) {
        return res
          .status(404)
          .json({ message: `Not found schedule by id ${scheduleId}` });
      }
      return res.status(204).send();
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  getScheduleForStudent = async (req, res, next) => {
    try {
      //TODO after JWT
      //   const studentId = req.studentIdFromJWT;
      const studentId = req.query.studentId;
      const date = req.query.date;
      const weekdayNumber = req.query.weekdayNumber;
      const weekType = req.query.weekType;
      const result = await ScheduleService.getScheduleForStudent(
        studentId,
        date,
        weekdayNumber,
        weekType
      );
      return res.status(200).json({
        data: result,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
  getScheduleForTeacher = async (req, res, next) => {
    try {

      const teacherId = req.query.teacherId;
      const date = req.query.date;
      const weekdayNumber = req.query.weekdayNumber || null;
      const weekType = req.query.weekType|| null;
      const result = await ScheduleService.getScheduleForTeacher({
        teacherId,
        date,
        weekdayNumber,
        weekType,
      });
      return res.status(200).json({
        data: result,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
  getSemesterByDate = async (req, res, next) => {
    try {
      const date = req.query.date;
      const result = await ScheduleService.getCurrentSemester(date);
      return res.status(200).json({
        data: result,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
  getScheduleByDate = async (req, res, next) => {
    try {
      const date = req.query.date;
      const result = await ScheduleService.getCurrentSchedule(date);
      return res.status(200).json({
        data: result,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
  getLessonsForStudent = async (req, res, next) => {
    try {
      //TODO after JWT
      //   const studentId = req.studentIdFromJWT;
      const studentId = req.query.studentId;
      const date = req.query.date;
      const result = await ScheduleService.getLessonsForStudent({
        studentId,
        date,
      });
      return res.status(200).json({
        data: result,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
}

module.exports = new ScheduleController();
