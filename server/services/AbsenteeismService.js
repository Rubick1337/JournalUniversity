const { model } = require("../db");
const ApiError = require("../error/ApiError");
const {
  Absenteeism,
  Lesson,
  Student,
  Op,
  Sequelize,
  Person,
} = require("../models/index");
const ScheduleService = require("./ScheduleService");
const StudentService = require("./StudentService");

class AbsenteeismService {
  // Создание новой записи о прогуле
  async create(data) {
    try {
      const absenteeism = await Absenteeism.create({
        count_excused_hour: data.countExcusedHour || 0,
        count_unexcused_hour: data.countUnexcusedHour || 0,
        lesson_id: data.lessonId,
        student_id: data.studentId,
      });

      return await this._getAbsenteeismWithAssociations(absenteeism.id);
    } catch (error) {
      throw ApiError.badRequest("Ошибка при создании записи о прогуле", error);
    }
  }

  // Обновление записи о прогуле
  async update(absenteeismId, updateData) {
    try {
      const absenteeism = await Absenteeism.findByPk(absenteeismId);
      if (!absenteeism) {
        throw ApiError.notFound(
          `Запись о прогуле с ID ${absenteeismId} не найдена`
        );
      }

      await absenteeism.update({
        count_excused_hour: updateData.countExcusedHour,
        count_unexcused_hour: updateData.countUnexcusedHour,
        lesson_id: updateData.lessonId,
        student_id: updateData.studentId,
      });

      return await this._getAbsenteeismWithAssociations(absenteeismId);
    } catch (error) {
      throw ApiError.badRequest(
        "Ошибка при обновлении записи о прогуле",
        error
      );
    }
  }

  async getAll({
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "DESC",
    query = {
      lessonIdQuery: "",
      studentIdQuery: "",
    },
  }) {
    try {
      const offset = (page - 1) * limit;

      const where = {};

      if (query.lessonIdQuery) {
        where.lesson_id = query.lessonIdQuery;
      }

      if (query.studentIdQuery) {
        where.student_id = query.studentIdQuery;
      }

      const include = [
        {
          model: Student,
          as: "student",
          attributes: ["id"],
          include: [
            {
              model: Person,
              as: "person",
              attributes: ["id", "surname", "name", "middlename"],
            },
          ],
        },
      ];
      const { count, rows } = await Absenteeism.findAndCountAll({
        where,
        include,
        limit,
        offset,
        distinct: true,
      });

      return {
        data: rows,
        meta: {
          currentPage: page,
          perPage: limit,
          totalItems: count,
          totalPages: Math.ceil(count / limit),
          hasNextPage: page * limit < count,
          hasPreviousPage: page > 1,
        },
      };
    } catch (error) {
      throw ApiError.internal(
        "Ошибка при получении записей о прогулах: " + error.message
      );
    }
  }
  // Удаление записи о прогуле
  async delete(absenteeismId) {
    try {
      const absenteeism = await Absenteeism.findByPk(absenteeismId);
      if (!absenteeism) {
        return null;
      }
      await absenteeism.destroy();
      return absenteeism;
    } catch (error) {
      throw ApiError.internal(
        "Ошибка при удалении записи о прогуле: " + error.message
      );
    }
  }

  // Получение записи по ID
  async getById(absenteeismId) {
    try {
      const absenteeism = await this._getAbsenteeismWithAssociations(
        absenteeismId
      );

      if (!absenteeism) {
        throw ApiError.notFound(
          `Запись о прогуле с ID ${absenteeismId} не найдена`
        );
      }

      return absenteeism;
    } catch (error) {
      throw ApiError.internal(
        "Ошибка при получении записи о прогуле: " + error.message
      );
    }
  }

  // Вспомогательный метод для получения записи со связанными данными
  async _getAbsenteeismWithAssociations(absenteeismId) {
    return await Absenteeism.findByPk(absenteeismId, {
      include: [
        {
          model: Lesson,
          as: "lesson",
          // attributes: ["id", "name", "date", "start_time", "end_time"],
        },
        {
          model: Student,
          as: "student",
          include: [
            {
              model: Person,
              as: "person",
              attributes: ["id", "surname", "name", "middlename"],
            },
          ],
          // attributes: ["id", "surname", "name", "middlename", "group_id"],
        },
      ],
    });
  }

  getForStudent = async (studentId) => {
    try {
      const student = await StudentService.getById(studentId);
      const semester = await ScheduleService.getCurrentSemester();
      const { start, end } = semester;

      const absenteeisms = await Absenteeism.findAll({
        where: {
          student_id: student.id,
        },
        include: [
          {
            model: Lesson,
            as: "lesson",
            where: {
              date: {
                [Op.between]: [start, end],
              },
            },
          },
        ],
      });
      // Calculate total hours
      const totals = absenteeisms.reduce(
        (acc, absenteeism) => {
          return {
            excusedHours:
              acc.excusedHours + (absenteeism.count_excused_hour || 0),
            unexcusedHours:
              acc.unexcusedHours + (absenteeism.count_unexcused_hour || 0),
          };
        },
        { excusedHours: 0, unexcusedHours: 0 }
      );

      return {
        semester,
        totals,
      };
    } catch (err) {
      throw err;
    }
  };
}

module.exports = new AbsenteeismService();
