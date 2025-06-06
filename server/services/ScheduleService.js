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
} = require("../models/index");
const START_WITH_UPPER = false;

const StudentService = require("./StudentService");
class ScheduleService {
  static WEEK_TYPES = {
    UPPER: "Верхняя неделя",
    LOWER: "Нижняя неделя",
  };

  // Метод для определения дня недели (1-7, где 1 - понедельник)
  getDayOfWeek = (date) => {
    const day = date.getDay();
    return day === 0 ? 7 : day; // Воскресенье (0) преобразуем в 7
  };
  // Метод для определения типа недели (Верхняя/Нижняя)
  getWeekType = (date, startWithUpper = START_WITH_UPPER) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const diffInDays = Math.floor((date - startOfYear) / (1000 * 60 * 60 * 24));
    const weekNumber = Math.ceil((diffInDays + startOfYear.getDay() + 1) / 7);

    console.log(`Date: ${date.toISOString()}`);
    console.log(`Start of Year: ${startOfYear.toISOString()}`);
    console.log(`Difference in Days: ${diffInDays}`);
    console.log(`Week Number: ${weekNumber}`);

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
        },scheduleDetails
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
}

module.exports = new ScheduleService();
