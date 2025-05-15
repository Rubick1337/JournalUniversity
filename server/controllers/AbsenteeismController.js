const AbsenteeismService = require("../services/AbsenteeismService");

class AbsenteeismController {
  // Создание записи о прогуле
  create = async (req, res, next) => {
    try {
      const result = await AbsenteeismService.create(req.body);
      return res
        .status(200)
        .json({ message: "Запись о прогуле создана", data: result });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  // Получение всех записей о прогулах с пагинацией и фильтрацией
  getAll = async (req, res, next) => {
    try {
      const {
        limit = 10,
        page = 1,
        sortBy = "createdAt",
        sortOrder = "DESC",
        lessonQuery = "",
        studentQuery = "",
        excusedQuery = "",
        unexcusedQuery = "",
      } = req.query;

      const { data, meta } = await AbsenteeismService.getAll({
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder,
        query: {
          lessonQuery,
          studentQuery,
          excusedQuery,
          unexcusedQuery,
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

  // Получение записи о прогуле по ID
  getById = async (req, res, next) => {
    try {
      const { absenteeismId } = req.params;
      const data = await AbsenteeismService.getById(absenteeismId);
      return res.status(200).json({
        data: data,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  // Обновление записи о прогуле
  update = async (req, res, next) => {
    try {
      const { absenteeismId } = req.params;
      const result = await AbsenteeismService.update(absenteeismId, req.body);
      return res
        .status(200)
        .json({ message: "Запись о прогуле обновлена", data: result });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  // Удаление записи о прогуле
  delete = async (req, res, next) => {
    try {
      const { absenteeismId } = req.params;
      const result = await AbsenteeismService.delete(absenteeismId);
      if (!result) {
        return res
          .status(404)
          .json({
            message: `Запись о прогуле с ID ${absenteeismId} не найдена`,
          });
      }
      return res.status(204).send();
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  getForStudent = async (req, res, next) => {
    try {
      //TODO after JWT
      //   const studentId = req.studentIdFromJWT;
      const studentId = req.query.studentId;
      const data = await AbsenteeismService.getForStudent(studentId);
      return res.status(200).json({
        data: data,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
}

module.exports = new AbsenteeismController();
