const ScheduleService = require("../services/ScheduleService");

class ScheduleController {
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
      //TODO after JWT
      //   const studentId = req.studentIdFromJWT;
      const teacherId = req.query.teacherId;
      const date = req.query.date;
      const weekdayNumber = req.query.weekdayNumber;
      const weekType = req.query.weekType;
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
