const ApiError = require("../error/ApiError");
const {
  Student,
  Group,
  Subject,
  StudyPlan,
  StudyPlanTopics,
  Topic,
  SubjectType, 
  AssessmentMethod,
  Grade, // Добавляем модель Grade
  Op,
  Sequelize,
} = require("../models/index");

class StudyPlanService {
  getTopicsProgressForSubject = async (studentId, subjectId) => {
    try {
      // 1. Получаем студента по ID
      const student = await Student.findByPk(studentId);
      if (!student) {
        throw ApiError.badRequest("Студент не найден");
      }

      // 2. Получаем группу студента
      const group = await Group.findByPk(student.group_id);
      if (!group) {
        throw ApiError.badRequest("Группа не найдена");
      }

      // Извлекаем код специальности и год выпуска группы
      const { specialty_code, graduation_year } = group;

      // Получаем предмет
      const subject = await Subject.findByPk(subjectId);
      if (!subject) {
        throw ApiError.badRequest("Предмет не найдена");
      }

      // 3. Находим подходящий учебный план:
      const studyPlan = await StudyPlan.findOne({
        where: {
          academic_specialty_code: specialty_code,
          subject_id: subject.id,
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn("date_part", "year", Sequelize.col("start_date")),
              "<=",
              graduation_year
            ),
          ],
        },
        order: [["start_date", "DESC"]],
      });

      if (!studyPlan) {
        throw ApiError.badRequest(
          "Не найден учебный план для данной специальности и предмета"
        );
      }

      // 4. Получаем все темы из учебного плана с дополнительной информацией
      const studyPlanTopics = await StudyPlanTopics.findAll({
        where: {
          study_plan_id: studyPlan.id,
        },
        include: [
          {
            model: Topic,
            as: "topic",
            attributes: ["id", "name"],
          },
          {
            model: SubjectType,
            as: "subjectType",
            attributes: ["id", "name"],
          },
          {
            model: AssessmentMethod,
            as: "assessmentMethod",
            attributes: ["id", "name"],
          },
        ],
        order: [["week_number", "ASC"]],
      });

      // 5. Получаем все оценки студента по этим темам
      const grades = await Grade.findAll({
        where: {
          student_id: studentId,
          topic_id: studyPlanTopics.map(t => t.topic.id),
        },
      });

      // 6. Формируем итоговый результат с информацией о прогрессе
      const result = studyPlanTopics.map((topic) => {
        // Находим оценку для текущей темы
        const grade = grades.find(g => g.topic_id === topic.topic.id);
        
        return {
          id: topic.id,
          weekNumber: topic.week_number,
          hours: topic.number_of_hours,
          withDefense: topic.with_defense,
          topic: {
            id: topic.topic.id,
            name: topic.topic.name,
          },
          subjectType: {
            id: topic.subjectType.id,
            name: topic.subjectType.name,
          },
          assessmentMethod: {
            id: topic.assessmentMethod.id,
            name: topic.assessmentMethod.name,
          },
          progress: {
            isCompleted: !!grade, // true, если оценка есть
            completionDate: grade?.createdAt || null,
            score: grade?.value || null,
          },
        };
      });

      return result;
    } catch (error) {
      console.error("Ошибка при получении тем учебного плана:", error);
      throw error;
    }
  };

  getLabsStatsForStudent = async (studentId, subjectId) => {
    // Выносим ID типов лабораторных работ в константы
    const LAB_WORK_TYPE_IDS = [1, 2]; // ID для "лабораторная работа" и "практическая работа"

    try {
      // 1. Получаем базовую информацию (студент, группа, предмет)
      const student = await Student.findByPk(studentId, {
        // attributes: ['id', 'name', 'surname', 'patronymic'],
      });
      if (!student) {
        throw ApiError.badRequest("Студент не найден");
      }

      const group = await Group.findByPk(student.group_id, {
        // attributes: ['id', 'name', 'specialty_code', 'graduation_year'],
      });
      if (!group) {
        throw ApiError.badRequest("Группа не найдена");
      }

      const subject = await Subject.findByPk(subjectId, {
        // attributes: ['id', 'name'],
      });
      if (!subject) {
        throw ApiError.badRequest("Предмет не найден");
      }

      // 2. Находим учебный план
      const studyPlan = await StudyPlan.findOne({
        where: {
          academic_specialty_code: group.specialty_code,
          subject_id: subject.id,
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn("date_part", "year", Sequelize.col("start_date")),
              "<=",
              group.graduation_year
            ),
          ],
        },
        order: [["start_date", "DESC"]],
      });

      if (!studyPlan) {
        throw ApiError.badRequest("Учебный план не найден");
      }

      // 3. Получаем все лабораторные работы по предмету (фильтр по ID типа)
      const labs = await StudyPlanTopics.findAll({
        where: {
          study_plan_id: studyPlan.id,
        },
        include: [
          {
            model: Topic,
            as: "topic",
            // attributes: ["id", "name"],
          },
          {
            model: SubjectType,
            as: "subjectType",
            // attributes: ["id", "name"],
            where: { 
              id: { 
                [Op.in]: LAB_WORK_TYPE_IDS 
              } 
            },
          },
          {
            model: AssessmentMethod,
            as: "assessmentMethod",
            // attributes: ["id", "name"],
          },
        ],
      });

      // 4. Получаем оценки студента по этим лабораторным
      const grades = await Grade.findAll({
        where: {
          student_id: studentId,
          topic_id: labs.map(lab => lab.topic.id),
        },
      });

      // 5. Считаем статистику
      const totalLabs = labs.length;
      const completedLabs = grades.length;
      
      const totalHours = labs.reduce((sum, lab) => sum + lab.number_of_hours, 0);
      const completedHours = labs.reduce((sum, lab) => {
        const grade = grades.find(g => g.topic_id === lab.topic.id);
        return grade ? sum + lab.number_of_hours : sum;
      }, 0);

      // 6. Формируем результат
      return {
        subject,
        student,
        stats: {
          totalLabs,
          completedLabs,
          completionPercentage: totalLabs > 0 
            ? Math.round((completedLabs / totalLabs) * 100) 
            : 0,
          totalHours,
          completedHours,
          hoursPercentage: totalHours > 0 
            ? Math.round((completedHours / totalHours) * 100) 
            : 0,
        },
        labs: labs.map(lab => {
          const grade = grades.find(g => g.topic_id === lab.topic.id);
          return {
            id: lab.id,
            topic: lab.topic.name,
            hours: lab.number_of_hours,
            subjectType: {
              id: lab.subjectType.id,
              name: lab.subjectType.name,
            },
            isCompleted: !!grade,
            score: grade?.value || null,
            completionDate: grade?.createdAt || null,
          };
        }),
      };
    } catch (error) {
      console.error("Ошибка при получении статистики по лабораторным:", error);
      throw error;
    }
  };
}

module.exports = new StudyPlanService();