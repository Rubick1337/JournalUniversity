const { where } = require("sequelize");
const ApiError = require("../error/ApiError");
const {
  Pair,
  Audience,
  Teacher,
  Subject,
  SubjectType,
  TypeOfSemester,
  Schedule,
  ScheduleDetails,
  AcademicBuilding,
  Person,
  Op,
  Sequelize,
  Lesson,
  Group,
  Subgroup,
  TeachingPosition,
  Topic,
} = require("../models/index");
const START_WITH_UPPER = false;

const StudentService = require("./StudentService");
class ScheduleService {


    async create(data) {
    try {
      const schedule = await Schedule.create({
        name: data.name,
        start_date: data.start_date,
        type_of_semester_id: data.type_of_semester_id,
      });

      return schedule;
    } catch (error) {
      throw ApiError.badRequest("Error creating schedule", error);
    }
  }

  async update(scheduleId, updateData) {
    try {
      const schedule = await Schedule.findByPk(scheduleId);
      if (!schedule) {
        throw ApiError.notFound(
          `Schedule with ID ${scheduleId} not found`
        );
      }

      await schedule.update({
        name: updateData.name,
        start_date: updateData.start_date,
        type_of_semester_id: updateData.type_of_semester_id,
      });

      return schedule;
    } catch (error) {
      throw ApiError.badRequest("Error updating schedule", error);
    }
  }

  async getAll({
    page = 1,
    limit = 10,
    sortBy = "name",
    sortOrder = "ASC",
    query = {
      idQuery: "",
      nameQuery: "",
      dateQuery: "",
      typeOfSemesterQuery: "",
    },
  }) {
    try {
      const offset = (page - 1) * limit;

      const where = {};

      if (query.nameQuery) {
        where.name = { [Op.iLike]: `%${query.nameQuery}%` };
      }

      if (query.dateQuery) {
        where.start_date = { [Op.gte]: new Date(query.dateQuery) };
      }

      // idQuery с явным приведением типа
      if (query.idQuery) {
        where[Op.and] = [
          Sequelize.where(
            Sequelize.cast(Sequelize.col("Schedule.id"), "TEXT"),
            {
              [Op.iLike]: `%${query.idQuery}%`,
            }
          ),
        ];
      }

      const include = [];
      
      if (query.typeOfSemesterQuery) {
        include.push({
          model: TypeOfSemester,
          as: 'typeOfSemester',
          where: {
            name: { [Op.iLike]: `%${query.typeOfSemesterQuery}%` }
          },
          required: true
        });
      } else {
        include.push({
          model: TypeOfSemester,
          as: 'typeOfSemester',
        });
      }

      const { count, rows } = await Schedule.findAndCountAll({
        where,
        include,
        order: [[sortBy, sortOrder]],
        limit,
        offset,
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
        "Error fetching schedules: " + error.message
      );
    }
  }

  async delete(scheduleId) {
    try {
      const schedule = await Schedule.findByPk(scheduleId);
      if (!schedule) {
        return null;
      }
      await schedule.destroy();
      return schedule;
    } catch (error) {
      throw ApiError.internal(
        "Error deleting schedule: " + error.message
      );
    }
  }

  async getById(scheduleId) {
    try {
      const schedule = await Schedule.findByPk(scheduleId, {
        include: [{
          model: TypeOfSemester,
          as: 'typeOfSemester'
        }]
      });

      if (!schedule) {
        throw ApiError.notFound(
          `Schedule with ID ${scheduleId} not found`
        );
      }

      return schedule;
    } catch (error) {
      throw ApiError.internal(
        "Error fetching schedule: " + error.message
      );
    }
  }
  static WEEK_TYPES = {
    UPPER: "Верхняя неделя",
    LOWER: "Нижняя неделя",
  };

  // Метод для определения дня недели (1-7, где 1 - понедельник)
  getDayOfWeek = (date) => {
    const targetDate = date ? new Date(date) : new Date();

    const day = targetDate.getDay();
    return day === 0 ? 7 : day; // Воскресенье (0) преобразуем в 7
  };
  // Метод для определения типа недели (Верхняя/Нижняя)
  getWeekType = (date, startWithUpper = START_WITH_UPPER) => {
    const targetDate = date ? new Date(date) : new Date();

    const startOfYear = new Date(targetDate.getFullYear(), 0, 1);
    const diffInDays = Math.floor(
      (targetDate - startOfYear) / (1000 * 60 * 60 * 24)
    );
    const weekNumber = Math.ceil((diffInDays + startOfYear.getDay() + 1) / 7);

    // Определяем тип недели с учетом параметра startWithUpper
    const weekType =
      weekNumber % 2 === (startWithUpper ? 1 : 0)
        ? ScheduleService.WEEK_TYPES.UPPER
        : ScheduleService.WEEK_TYPES.LOWER;

    console.log(`Week Type: ${weekType}`);
    console.log(`Year starts with: ${startWithUpper ? "Upper" : "Lower"} week`);

    return weekType;
  };
  getScheduleForStudent = async (
    studentId,
    date,
    weekdayNumber = null,
    weekType = null
  ) => {
    try {
      // Получаем данные студента
      const student = await StudentService.getById(studentId);
      if (!student) {
        throw ApiError.badRequest("Student not found");
      }

      // Определяем переданную дату или текущую дату
      const targetDate = date ? new Date(date) : new Date();

      // Если номер дня недели не указан - вычисляем
      const calculatedWeekdayNumber =
        weekdayNumber !== null ? weekdayNumber : this.getDayOfWeek(targetDate);
      console.log("Номер дня недели:", calculatedWeekdayNumber);

      // Если тип недели не указан - вычисляем
      const calculatedWeekType =
        weekType !== null ? weekType : this.getWeekType(targetDate);
      console.log("Тип недели:", calculatedWeekType);

      // Получаем текущее расписание
      const currentSchedule = await this.getCurrentSchedule(targetDate);

      // Получаем ID группы и подгруппы студента
      const groupId = student.group.id;
      const subgroupId = student.subgroup.id;

      // Формируем условия для поиска пар
      const pairConditions = {
        weekday_number: calculatedWeekdayNumber,
      };

      // Добавляем условие по типу недели только если он указан или вычислен
      if (calculatedWeekType) {
        pairConditions.week_type_name = calculatedWeekType;
      }

      // Ищем детали расписания
      const scheduleDetails = await ScheduleDetails.findAll({
        where: {
          schedule_id: currentSchedule.id,
          group_id: groupId,
          [Op.or]: [{ subgroup_id: subgroupId }, { subgroup_id: null }],
        },
        include: [
          {
            model: Pair,
            as: "PairInSchedule",
            where: pairConditions,
          },
          { model: Subject, as: "subject" },
          {
            model: Audience,
            as: "audience",
            include: [{ model: AcademicBuilding, as: "academicBuilding" }],
          },
          {
            model: Teacher,
            as: "teacher",
            include: [{ model: Person, as: "person" }],
          },
          { model: SubjectType, as: "subjectType" },
        ],
        // order: [["PairInSchedule", "pair_number", "ASC"]],
      });

      return {
        student: {
          id: student.id,
          name: `${student.person.surname} ${student.person.name} ${
            student.person.middlename || ""
          }`.trim(),
          group: student.group.name,
          subgroup: student.subgroup.name,
        },
        schedule: {
          id: currentSchedule.id,
          name: currentSchedule.name,
          start_date: currentSchedule.start_date,
          semester: currentSchedule.typeOfSemester.name,
        },
        dateInfo: {
          date: targetDate,
          weekdayNumber: calculatedWeekdayNumber,
          weekType: calculatedWeekType,
          isUpperWeek: calculatedWeekType === ScheduleService.WEEK_TYPES.UPPER,
          wasCalculated: {
            weekdayNumber: weekdayNumber === null,
            weekType: weekType === null,
          },
        },
        scheduleDetails,
        /* scheduleDetails: scheduleDetails.map((detail) => ({
          id: detail.id,
          pair: detail.PairInSchedule
            ? {
                number: detail.PairInSchedule.pair_number,
                name: detail.PairInSchedule.name,
                start: detail.PairInSchedule.start,
                end: detail.PairInSchedule.end,
                break_start: detail.PairInSchedule.break_start,
                break_end: detail.PairInSchedule.break_end,
              }
            : null,
          subject: {
            id: detail.subject.id,
            name: detail.subject.name,
          },
          subjectType: {
            id: detail.subjectType.id,
            name: detail.subjectType.name,
          },
          audience: {
            id: detail.audience.id,
            number: detail.audience.number,
            academicBuilding: {
              id: detail.audience.academicBuilding.id,
              name: detail.audience.academicBuilding.name,
            }
          },
          teacher: {
            id: detail.teacher.id,
            name: `${detail.teacher.person.surname} ${
              detail.teacher.person.name
            } ${detail.teacher.person.middlename || ""}`.trim(),
          },
          subgroup: detail.subgroup_id
            ? {
                id: detail.subgroup_id,
                name: detail.SubroupInSchedule?.name,
              }
            : null,
        })),*/
      };
    } catch (error) {
      console.error("Error in getScheduleForStudent:", error);
      throw error;
    }
  };
  getCurrentSchedule = async (date) => {
    try {
      const currentSemester = await this.getCurrentSemester(date);
      const targetDate = date ? new Date(date) : new Date();

      // Ищем расписание для текущего семестра, где start_date <= targetDate
      // и сортируем по убыванию даты начала, чтобы получить самое актуальное
      const schedule = await Schedule.findOne({
        where: {
          type_of_semester_id: currentSemester.id,
          start_date: {
            [Op.lte]: targetDate,
          },
        },
        order: [["start_date", "DESC"]],
        include: [
          {
            model: TypeOfSemester,
            as: "typeOfSemester",
          },
        ],
      });

      if (!schedule) {
        throw ApiError.badRequest(
          `No schedule found for date ${targetDate} and type of semester ${currentSemester.name}`
        );
      }

      return schedule;
    } catch (error) {
      console.error("Error finding current schedule:", error);
      throw error;
    }
  };

  getCurrentSemester = async (date) => {
    try {
      // Если дата не передана, используем текущую дату
      const targetDate = date ? new Date(date) : new Date();

      // Находим семестр, в который попадает переданная дата
      const semester = await TypeOfSemester.findOne({
        where: {
          start: { [Op.lte]: targetDate },
          end: { [Op.gte]: targetDate },
        },
      });
      if (!semester) {
        throw ApiError.badRequest("Not found semester");
      }
      return semester;
    } catch (error) {
      console.error("Error finding current semester:", error);
      throw error;
    }
  };
  getLessonsForStudent = async ({ studentId, date }) => {
    try {
      // Получаем данные студента
      const student = await StudentService.getById(studentId);
      if (!student) {
        throw ApiError.badRequest("Student not found");
      }

      // Определяем переданную дату или текущую дату
      const targetDate = date ? new Date(date) : new Date();

      //TODO добавить обработчик на будущее даты

      const result = await Lesson.findAll({
        where: {
          group_id: student.group.id,
          subgroup_id: student.subgroup.id,
          date: targetDate,
        },
        include: [
          {
            model: Group,
            as: "GroupForLesson",
            // attributes: ["id", "name"]
          },
          {
            model: Subgroup,
            as: "SubgroupForLesson",
            // attributes: ["id", "name"]
          },
          {
            model: Subject,
            as: "SubjectForLesson",
            // attributes: ["id", "name"]
          },
          {
            model: Teacher,
            as: "TeacherForLesson",
            include: [
              {
                model: Person,
                as: "person",
                // attributes: ["id", "surname", "name", "middlename"]
              },
              {
                model: TeachingPosition,
                as: "teachingPosition",
                // attributes: ["id", "name"]
              },
            ],
          },
          {
            model: Topic,
            as: "TopicForLesson",
            // attributes: ["id", "name"]
          },
          {
            model: Audience,
            as: "AudienceForLesson",
            include: [
              {
                model: AcademicBuilding,
                as: "academicBuilding",
              },
            ],
            // attributes: ["id", "number"]
          },
          {
            model: SubjectType,
            as: "SubjectTypeForLesson",
            // attributes: ["id", "name"]
          },
          {
            model: Pair,
            as: "PairForLesson",
            // attributes: ["id", "name", "start"]
          },
        ],
      });
      return result;
    } catch (err) {
      throw err;
    }
  };
  getScheduleForTeacher = async ({
    teacherId,
    date,
    weekdayNumber,
    weekType,
  }) => {
    try {
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };
}

module.exports = new ScheduleService();
