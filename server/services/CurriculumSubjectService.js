const ApiError = require("../error/ApiError");
const {
  CurriculumSubject,
  Curriculum,
  Subject,
  AssessmentType,
  AcademicSpecialty,
  Student,
  Op,
  Sequelize,
  Group,
} = require("../models/index");
const GroupService = require("./GroupService");
const ScheduleService = require("./ScheduleService");
const StudentService = require("./StudentService");

class CurriculumSubjectService {
  async create(curriculumId, data) {
    try {
      // Проверяем существование curriculum
      const curriculum = await Curriculum.findByPk(curriculumId);
      if (!curriculum) {
        throw ApiError.notFound(`Curriculum with id ${curriculumId} not found`);
      }

      // Проверяем существование subject
      const subject = await Subject.findByPk(data.subject_id);
      if (!subject) {
        throw ApiError.notFound(`Subject with id ${data.subject_id} not found`);
      }

      // Проверяем существование assessment type
      const assessmentType = await AssessmentType.findByPk(
        data.assessment_type_id
      );
      if (!assessmentType) {
        throw ApiError.notFound(
          `Assessment type with id ${data.assessment_type_id} not found`
        );
      }

      // Проверяем, не существует ли уже такой записи
      const existingRecord = await CurriculumSubject.findOne({
        where: {
          curriculum_id: curriculumId,
          subject_id: data.subject_id,
          assessment_type_id: data.assessment_type_id,
          semester: data.semester,
        },
      });

      if (existingRecord) {
        throw ApiError.badRequest(
          "This subject with the same assessment type and semester already exists in the curriculum"
        );
      }

      const curriculumSubject = await CurriculumSubject.create({
        curriculum_id: curriculumId,
        subject_id: data.subject_id,
        assessment_type_id: data.assessment_type_id,
        semester: data.semester,
        all_hours: data.all_hours,
        lecture_hours: data.lecture_hours,
        lab_hours: data.lab_hours,
        practice_hours: data.practice_hours,
      });

      return await this._getCurriculumSubjectWithAssociations(
        curriculumId,
        data.subject_id,
        data.assessment_type_id,
        data.semester
      );
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw ApiError.badRequest("Error creating curriculum subject", error);
    }
  }

  async update(curriculumId, compositeId, updateData) {
    try {
      // Проверяем, что curriculumId в compositeId совпадает с переданным curriculumId
      if (compositeId.curriculumId !== curriculumId) {
        throw ApiError.badRequest(
          "Curriculum ID in composite ID does not match the provided curriculum ID"
        );
      }

      const curriculumSubject = await CurriculumSubject.findOne({
        where: {
          curriculum_id: curriculumId,
          subject_id: compositeId.subjectId,
          assessment_type_id: compositeId.assessmentTypeId,
          semester: compositeId.semester,
        },
      });

      if (!curriculumSubject) {
        throw ApiError.notFound(
          `Curriculum subject with specified composite id not found in curriculum ${curriculumId}`
        );
      }

      // Если пытаемся изменить subject_id, assessment_type_id или semester, проверяем, что новая запись не существует
      if (
        updateData.subject_id ||
        updateData.assessment_type_id ||
        updateData.semester
      ) {
        const newSubjectId = updateData.subject_id || compositeId.subjectId;
        const newAssessmentTypeId =
          updateData.assessment_type_id || compositeId.assessmentTypeId;
        const newSemester = updateData.semester || compositeId.semester;

        if (
          newSubjectId !== compositeId.subjectId ||
          newAssessmentTypeId !== compositeId.assessmentTypeId ||
          newSemester !== compositeId.semester
        ) {
          const existingRecord = await CurriculumSubject.findOne({
            where: {
              curriculum_id: curriculumId,
              subject_id: newSubjectId,
              assessment_type_id: newAssessmentTypeId,
              semester: newSemester,
            },
          });

          if (existingRecord) {
            throw ApiError.badRequest(
              "A record with the new subject, assessment type and semester combination already exists in this curriculum"
            );
          }
        }
      }

      await curriculumSubject.update({
        subject_id: updateData.subject_id || compositeId.subjectId,
        assessment_type_id:
          updateData.assessment_type_id || compositeId.assessmentTypeId,
        semester: updateData.semester || compositeId.semester,
        all_hours: updateData.all_hours,
        lecture_hours: updateData.lecture_hours,
        lab_hours: updateData.lab_hours,
        practice_hours: updateData.practice_hours,
      });

      return await this._getCurriculumSubjectWithAssociations(
        curriculumId,
        updateData.subject_id || compositeId.subjectId,
        updateData.assessment_type_id || compositeId.assessmentTypeId,
        updateData.semester || compositeId.semester
      );
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw ApiError.badRequest("Error updating curriculum subject", error);
    }
  }

  async getAll({
    curriculumId,
    page = 1,
    limit = 10,
    sortBy = "semester",
    sortOrder = "ASC",
    query = {
      curriculumQuery: "",
      subjectQuery: "",
      assessmentTypeQuery: "",
      semesterQuery: "",
    },
  }) {
    try {
      const offset = (page - 1) * limit;

      const where = {
        curriculum_id: curriculumId,
      };

      const include = [
        {
          model: Curriculum,
          as: "curriculum",
          attributes: ["id", "year_of_specialty_training"],
          required: true,
          where: {
            id: curriculumId,
            ...(query.curriculumQuery && {
              year_of_specialty_training: {
                [Op.iLike]: `%${query.curriculumQuery}%`,
              },
            }),
          },
          include: [
            {
              model: AcademicSpecialty,
              as: "AcademicSpecialty",
              attributes: ["code", "name"],
            },
          ],
        },
        {
          model: Subject,
          as: "subject",
          attributes: ["id", "name"],
          required: !!query.subjectQuery,
          include: [
            {
              association: "department",
              attributes: ["id", "name", "full_name"],
            },
          ],
          where: query.subjectQuery
            ? {
                name: { [Op.iLike]: `%${query.subjectQuery}%` },
              }
            : undefined,
        },
        {
          model: AssessmentType,
          as: "assessmentType",
          attributes: ["id", "name"],
          required: !!query.assessmentTypeQuery,
          where: query.assessmentTypeQuery
            ? {
                name: { [Op.iLike]: `%${query.assessmentTypeQuery}%` },
              }
            : undefined,
        },
      ];

      if (query.semesterQuery) {
        where.semester = {
          [Op.eq]: query.semesterQuery,
        };
      }

      const { count, rows } = await CurriculumSubject.findAndCountAll({
        where,
        include,
        order: [[sortBy, sortOrder]],
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
        "Error fetching curriculum subjects: " + error.message
      );
    }
  }

  async delete(curriculumId, compositeId) {
    try {
      // Проверяем, что curriculumId в compositeId совпадает с переданным curriculumId
      if (compositeId.curriculumId !== curriculumId) {
        throw ApiError.badRequest(
          "Curriculum ID in composite ID does not match the provided curriculum ID"
        );
      }

      const curriculumSubject = await CurriculumSubject.findOne({
        where: {
          curriculum_id: curriculumId,
          subject_id: compositeId.subjectId,
          assessment_type_id: compositeId.assessmentTypeId,
          semester: compositeId.semester,
        },
      });

      if (!curriculumSubject) {
        return null;
      }

      await curriculumSubject.destroy();
      return curriculumSubject;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw ApiError.internal(
        "Error deleting curriculum subject: " + error.message
      );
    }
  }

  async getByCompositeId(curriculumId, compositeId) {
    try {
      // Проверяем, что curriculumId в compositeId совпадает с переданным curriculumId
      if (compositeId.curriculumId !== curriculumId) {
        throw ApiError.badRequest(
          "Curriculum ID in composite ID does not match the provided curriculum ID"
        );
      }

      const curriculumSubject =
        await this._getCurriculumSubjectWithAssociations(
          curriculumId,
          compositeId.subjectId,
          compositeId.assessmentTypeId,
          compositeId.semester
        );

      if (!curriculumSubject) {
        throw ApiError.notFound(
          `Curriculum subject with specified composite id not found in curriculum ${curriculumId}`
        );
      }

      return curriculumSubject;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw ApiError.internal(
        "Error fetching curriculum subject: " + error.message
      );
    }
  }

  async _getCurriculumSubjectWithAssociations(
    curriculumId,
    subjectId,
    assessmentTypeId,
    semester
  ) {
    return await CurriculumSubject.findOne({
      where: {
        curriculum_id: curriculumId,
        subject_id: subjectId,
        assessment_type_id: assessmentTypeId,
        semester: semester,
      },
      include: [
        {
          model: Curriculum,
          as: "curriculum",
          attributes: ["id", "year_of_specialty_training"],
          include: [
            {
              model: AcademicSpecialty,
              as: "AcademicSpecialty",
              attributes: ["code", "name"],
            },
          ],
        },
        {
          model: Subject,
          as: "subject",
          attributes: ["id", "name"],
          include: [
            {
              association: "department",
              attributes: ["id", "name", "full_name"],
            },
          ],
        },
        {
          model: AssessmentType,
          as: "assessmentType",
          attributes: ["id", "name"],
        },
      ],
    });
  }

  getCurrentCurriculumForStudent = async (studentId) => {
    try {
      // Находим студента
      const student = await StudentService.getById(studentId);
      const group = await GroupService.getById(student.group_id);
      // Находим самый свежий учебный план
      const curriculum = await Curriculum.findOne({
        where: {
          specialty_code: group.specialty_code,
          year_of_specialty_training: {
            [Op.gte]: group.graduation_year,
          },
        },
        order: [["year_of_specialty_training", "DESC"]], // Сортируем по году обучения в обратном порядке
      });

      if (!curriculum) {
        throw new Error("Curriculum not found for student");
      }
      return curriculum;
    } catch (error) {
      console.error("Error :", error);
      throw error;
    }
  };
  getNumberSemesterInCurriculum = async (
    yearStartEducation,
    date = new Date()
  ) => {
    try {
      // Преобразуем входные параметры
      const startYear = parseInt(yearStartEducation);
      const currentDate = new Date(date);

      // Проверяем валидность года начала обучения
      if (isNaN(startYear)) {
        throw new Error("Invalid start year");
      }

      // Получаем текущий год и месяц
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1; // Месяцы 1-12

      // Вычисляем разницу в годах между текущим годом и годом начала обучения
      const yearDiff = currentYear - startYear;

      // Определяем текущий семестр
      let semester;

      if (currentMonth >= 9 || currentMonth === 1) {
        // Осенний семестр: сентябрь-декабрь и январь
        semester = 1 + 2 * yearDiff;
      } else if (currentMonth >= 2 && currentMonth <= 8) {
        // Весенний семестр: февраль-август
        semester =
          2 + 2 * (currentYear - startYear - (currentMonth < 9 ? 1 : 0));
      } else {
        // На всякий случай (не должно происходить)
        throw new Error("Invalid month calculation");
      }

      // Корректировка для января (он относится к осеннему семестру предыдущего года)
      if (currentMonth === 1) {
        semester = 1 + 2 * (yearDiff - 1);
      }

      return semester;
    } catch (err) {
      console.error("Error calculating semester number:", err);
      throw err;
    }
  };

  async getStudentSubjects(studentId) {
    try {
      // 1. Получаем текущий учебный план студента
      const curriculum = await this.getCurrentCurriculumForStudent(studentId);

      // 2. Определяем текущий семестр
      const currentSemester = await this.getNumberSemesterInCurriculum(
        curriculum.year_of_specialty_training
      );

      // 3. Получаем все предметы для текущего семестра
      const curriculumSubjects = await CurriculumSubject.findAll({
        where: {
          curriculum_id: curriculum.id,
          semester: currentSemester,
        },
        include: [
          {
            model: Subject,
            as: "subject",
            attributes: ["id", "name"],
            include: [
              {
                association: "department",
                attributes: ["id", "name", "full_name"],
              },
            ],
          },
          {
            model: AssessmentType,
            as: "assessmentType",
            attributes: ["id", "name"],
          },
        ],
        attributes: [
          "all_hours",
          "lecture_hours",
          "lab_hours",
          "practice_hours",
          "semester",
        ],
      });

      // 4. Форматируем результат
      return curriculumSubjects.map((item) => ({
        id: item.id,
        subject: {
          id: item.subject.id,
          name: item.subject.name,
          department: item.subject.department,
        },
        assessmentType: item.assessmentType,
        hours: {
          all: item.all_hours,
          lecture: item.lecture_hours,
          lab: item.lab_hours,
          practice: item.practice_hours,
        },
      }));
    } catch (error) {
      console.error("Error getting student subjects:", error);
      throw ApiError.internal(
        "Error getting student subjects: " + error.message
      );
    }
  }
}

module.exports = new CurriculumSubjectService();
