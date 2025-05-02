// GroupService.js
const ApiError = require("../error/ApiError");
const {
  Group,
  Faculty,
  Department,
  AcademicSpecialty,
  Person,
  Curriculum,
  CurriculumSubject,
  Subject,
  AssessmentType,
  Op,
  Sequelize,
} = require("../models/index");

class GroupService {
  async create(data) {
    try {
      const group = await Group.create({
        name: data.name,
        graduation_year: data.graduationYear,
        year_of_beginning_of_study: data.yearOfBeginningOfStudy,
        faculty_id: data.facultyId,
        department_id: data.departmentId,
        specialty_code: data.academicSpecialtyCode,
        class_representative_person_id: data.classRepresentativeId || null,
        teacher_curator_id: data.teacherCuratorId || null,
      });

      return await this._getGroupWithAssociations(group.id);
    } catch (error) {
      throw ApiError.badRequest("Error creating group", error);
    }
  }

  async update(groupId, updateData) {
    try {
      const group = await Group.findByPk(groupId);
      if (!group) {
        throw ApiError.notFound(`Group with ID ${groupId} not found`);
      }

      await group.update({
        name: updateData.name,
        graduation_year: updateData.graduationYear,
        year_of_beginning_of_study: updateData.yearOfBeginningOfStudy,
        faculty_id: updateData.facultyId,
        department_id: updateData.departmentId,
        specialty_code: updateData.academicSpecialtyCode,
        class_representative_person_id: updateData.classRepresentativeId || null,
        teacher_curator_id: updateData.teacherCuratorId || null,
      });

      return await this._getGroupWithAssociations(groupId);
    } catch (error) {
      throw ApiError.badRequest("Error updating group", error);
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
      facultyQuery: "",
      departmentQuery: "",
      specialtyQuery: "",
      classRepresentativeQuery: "",
      teacherCuratorQuery: "",
    },
  }) {
    try {
      const offset = (page - 1) * limit;

      const where = {};

      if (query.nameQuery) {
        where.name = { [Op.iLike]: `%${query.nameQuery}%` };
      }

      if (query.idQuery) {
        where[Op.and] = [
          Sequelize.where(Sequelize.cast(Sequelize.col("Group.id"), "TEXT"), {
            [Op.iLike]: `%${query.idQuery}%`,
          }),
        ];
      }

      const include = [
        {
          model: Faculty,
          as: "faculty",
          attributes: ["id", "name", "full_name"],
          required: !!query.facultyQuery,
          where: query.facultyQuery
            ? {
                [Op.or]: [
                  { name: { [Op.iLike]: `%${query.facultyQuery}%` } },
                  { full_name: { [Op.iLike]: `%${query.facultyQuery}%` } },
                ],
              }
            : undefined,
        },
        {
          model: Department,
          as: "department",
          attributes: ["id", "name", "full_name"],
          required: !!query.departmentQuery,
          where: query.departmentQuery
            ? {
                [Op.or]: [
                  { name: { [Op.iLike]: `%${query.departmentQuery}%` } },
                  { full_name: { [Op.iLike]: `%${query.departmentQuery}%` } },
                ],
              }
            : undefined,
        },
        {
          model: AcademicSpecialty,
          as: "academicSpecialty",
          attributes: ["code", "name"],
          required: !!query.specialtyQuery,
          where: query.specialtyQuery
            ? {
                [Op.or]: [
                  { name: { [Op.iLike]: `%${query.specialtyQuery}%` } },
                  { code: { [Op.iLike]: `%${query.specialtyQuery}%` } },
                ],
              }
            : undefined,
        },
        {
          model: Person,
          as: "classRepresentative",
          attributes: ["id", "surname", "name", "middlename"],
          required: !!query.classRepresentativeQuery,
          where: query.classRepresentativeQuery
            ? {
                [Op.or]: [
                  {
                    surname: {
                      [Op.iLike]: `%${query.classRepresentativeQuery}%`,
                    },
                  },
                  {
                    name: { [Op.iLike]: `%${query.classRepresentativeQuery}%` },
                  },
                  {
                    middlename: {
                      [Op.iLike]: `%${query.classRepresentativeQuery}%`,
                    },
                  },
                ],
              }
            : undefined,
        },
        {
          model: Person,
          as: "teacherCurator",
          attributes: ["id", "surname", "name", "middlename"],
          required: !!query.teacherCuratorQuery,
          where: query.teacherCuratorQuery
            ? {
                [Op.or]: [
                  { surname: { [Op.iLike]: `%${query.teacherCuratorQuery}%` } },
                  { name: { [Op.iLike]: `%${query.teacherCuratorQuery}%` } },
                  {
                    middlename: {
                      [Op.iLike]: `%${query.teacherCuratorQuery}%`,
                    },
                  },
                ],
              }
            : undefined,
        },
      ];

      const { count, rows } = await Group.findAndCountAll({
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
      throw ApiError.internal("Error fetching groups: " + error.message);
    }
  }

  async delete(groupId) {
    try {
      const group = await Group.findByPk(groupId);
      if (!group) {
        return null;
      }
      await group.destroy();
      return group;
    } catch (error) {
      throw ApiError.internal("Error deleting group: " + error.message);
    }
  }

  async getById(groupId) {
    try {
      const group = await this._getGroupWithAssociations(groupId);

      if (!group) {
        throw ApiError.notFound(`Group with ID ${groupId} not found`);
      }

      return group;
    } catch (error) {
      throw ApiError.internal("Error fetching group: " + error.message);
    }
  }

  async _getGroupWithAssociations(groupId) {
    return await Group.findByPk(groupId, {
      include: [
        {
          model: Faculty,
          as: "faculty",
          attributes: ["id", "name", "full_name"],
        },
        {
          model: Department,
          as: "department",
          attributes: ["id", "name", "full_name"],
        },
        {
          model: AcademicSpecialty,
          as: "academicSpecialty",
          attributes: ["code", "name"],
        },
        {
          model: Person,
          as: "classRepresentative",
          attributes: ["id", "surname", "name", "middlename"],
        },
        {
          model: Person,
          as: "teacherCurator",
          attributes: ["id", "surname", "name", "middlename"],
        },
      ],
    });
  }
  async getCurrentCurriculum(groupId) {
    try {
      // Получаем группу с нужными полями
      const group = await Group.findByPk(groupId, {
        attributes: ['specialty_code', 'graduation_year'],
        raw: true
      });
  
      if (!group) {
        throw ApiError.notFound(`Group with ID ${groupId} not found`);
      }
  
      const { specialty_code, graduation_year } = group;
  
      // Ищем учебный план с точным совпадением года
      let curriculum = await Curriculum.findOne({
        where: {
          specialty_code,
          year_of_specialty_training: graduation_year
        },
        order: [['year_of_specialty_training', 'DESC']]
      });
  
      // Если точного совпадения нет, ищем ближайший меньший год
      if (!curriculum) {
        curriculum = await Curriculum.findOne({
          where: {
            specialty_code,
            year_of_specialty_training: {
              [Op.lte]: graduation_year
            }
          },
          order: [['year_of_specialty_training', 'DESC']]
        });
      }
  
      if (!curriculum) {
        throw ApiError.notFound(
          `No curriculum found for specialty ${specialty_code} and graduation year ${graduation_year}`
        );
      }
      return curriculum;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw ApiError.internal("Error finding curriculum: " + error.message);
    }
  }
  async getCurrentSubjectsByGroup(groupId) {
    try {
      // Получаем текущий учебный план для группы
      const curriculum = await this.getCurrentCurriculum(groupId);
      if (!curriculum) {
        throw ApiError.notFound(`Current curriculum not found for group ${groupId}`);
      }
  
      // Получаем текущий семестр для группы
      const semester = await this.getCurrentSemester(groupId);
      if (!semester) {
        throw ApiError.notFound(`Current semester not found for group ${groupId}`);
      }
  
      // Ищем все предметы в учебном плане для текущего семестра
      const currentSubjects = await CurriculumSubject.findAll({
        where: {
          curriculum_id: curriculum.id,
          semester: semester
        },
        include: [
          {
            model: Subject,
            as: "subject",
            attributes: ["id", "name"],
            include: [{
              association: 'department',
              attributes: ['id', 'name', 'full_name']
            }]
          },
          {
            model: AssessmentType,
            as: "assessmentType",
            attributes: ["id", "name"]
          }
        ],
        order: [
          ['subject', 'name', 'ASC']
        ]
      });
      return currentSubjects;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw ApiError.internal("Error fetching current subjects: " + error.message);
    }
  }
  async getCurrentSemester(groupId) {
    try {
      const group = await Group.findByPk(groupId);
      if (!group) {
        throw ApiError.notFound(`Group with ID ${groupId} not found`);
      }
  
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1; // месяцы в JS 0-11
  
      // Вычисляем разницу в годах
      const yearDifference = currentYear - group.graduation_year;
  
      // Базовый расчет семестра (каждый год = 2 семестра)
      let semester = yearDifference * 2;
  
      // Если текущий месяц сентябрь или позже (месяц >= 9), добавляем 1 семестр
      if (currentMonth >= 9) {
        semester += 1;
      }
  
      // Семестр не может быть отрицательным
      semester = Math.max(semester, 1);
  
      return semester;
    } catch (error) {
      throw ApiError.internal("Error calculating current semester: " + error.message);
    }
  }
}

module.exports = new GroupService();
