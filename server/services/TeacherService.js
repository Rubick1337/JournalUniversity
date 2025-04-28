const ApiError = require("../error/ApiError");
const { Teacher, Person, Department, TeachingPosition, Op, Sequelize } = require("../models/index");

class TeacherService {
  async create(data) {
    try {
      console.log('=== Данные для создания учителя ===');
      console.log('Исходные данные:', data);

      // Проверяем все возможные варианты именования
      const teacherData = {
        person_id: data.person_id || data.person?.id || data.name?.id,
        department_id: data.department_id || data.department,
        teaching_position_id: data.teacher_position_id || data.teaching_position_id || data.position
      };

      console.log('Данные для создания:', teacherData);

      // Валидация
      if (!teacherData.teaching_position_id) {
        throw new Error('Teacher position ID is required');
      }

      const teacher = await Teacher.create({
        person_id: teacherData.person_id,
        department_id: teacherData.department_id,
        teaching_position_id: teacherData.teaching_position_id // Используем правильное имя поля
      });

      return await this._getTeacherWithAssociations(teacher.id);
    } catch (error) {
      throw ApiError.badRequest("Error creating teacher", error);
    }
  }

  async update(teacherId, updateData) {
    try {
      const teacher = await Teacher.findByPk(teacherId);
      if (!teacher) {
        throw ApiError.notFound(`Teacher with ID ${teacherId} not found`);
      }

      await teacher.update({
        person_id: updateData.person_id,
        department_id: updateData.department_id,
        teaching_position_id: updateData.teaching_position_id // Исправлено с teacher_position_id
      });

      return await this._getTeacherWithAssociations(teacherId);
    } catch (error) {
      throw ApiError.badRequest("Error updating teacher", error);
    }
  }

  async getAll({
                 page = 1,
                 limit = 10,
                 sortBy = "id",
                 sortOrder = "ASC",
                 query = {
                   idQuery: "",
                   personQuery: "",
                   departmentQuery: "",
                   positionQuery: "",
                 },
               }) {
    try {
      const offset = (page - 1) * limit;

      const where = {};

      if (query.idQuery) {
        where[Op.and] = [
          Sequelize.where(
              Sequelize.cast(Sequelize.col("Teacher.id"), "TEXT"),
              {
                [Op.iLike]: `%${query.idQuery}%`,
              }
          ),
        ];
      }

      const include = [
        {
          model: Person,
          as: "person",
          attributes: ["id", "surname", "name", "middlename"],
          required: !!query.personQuery,
          where: query.personQuery
              ? {
                [Op.or]: [
                  { surname: { [Op.iLike]: `%${query.personQuery}%` } },
                  { name: { [Op.iLike]: `%${query.personQuery}%` } },
                  { middlename: { [Op.iLike]: `%${query.personQuery}%` } },
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
          model: TeachingPosition,
          as: "teachingPosition",
          attributes: ["id", "name"],
          required: !!query.positionQuery,
          where: query.positionQuery
              ? {
                name: { [Op.iLike]: `%${query.positionQuery}%` },
              }
              : undefined,
        },
      ];

      // Обработка сортировки
      let order;
      if (sortBy.includes('person.')) {
        const field = sortBy.split('.')[1];
        order = [[{ model: Person, as: 'person' }, field, sortOrder]];
      } else if (sortBy.includes('department.')) {
        const field = sortBy.split('.')[1];
        order = [[{ model: Department, as: 'department' }, field, sortOrder]];
      } else if (sortBy.includes('teachingPosition.')) {
        const field = sortBy.split('.')[1];
        order = [[{ model: TeachingPosition, as: 'teachingPosition' }, field, sortOrder]];
      } else {
        order = [[sortBy, sortOrder]];
      }

      const { count, rows } = await Teacher.findAndCountAll({
        where,
        include,
        order,
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
      console.error('Error in TeacherService.getAll:', error);
      throw ApiError.internal("Error fetching teachers: " + error.message);
    }
  }

  async delete(teacherId) {
    try {
      const teacher = await Teacher.findByPk(teacherId);
      if (!teacher) {
        return null;
      }
      await teacher.destroy();
      return teacher;
    } catch (error) {
      throw ApiError.internal("Error deleting teacher: " + error.message);
    }
  }

  async getById(teacherId) {
    try {
      const teacher = await this._getTeacherWithAssociations(teacherId);

      if (!teacher) {
        throw ApiError.notFound(`Teacher with ID ${teacherId} not found`);
      }

      return teacher;
    } catch (error) {
      throw ApiError.internal("Error fetching teacher: " + error.message);
    }
  }

  async _getTeacherWithAssociations(teacherId) {
    return await Teacher.findByPk(teacherId, {
      include: [
        {
          model: Person,
          as: "person",
          attributes: ["id", "surname", "name", "middlename"],
        },
        {
          model: Department,
          as: "department",
          attributes: ["id", "name", "full_name"],
        },
        {
          model: TeachingPosition,
          as: "teachingPosition",
          attributes: ["id", "name"],
        },
      ],
    });
  }
}

module.exports = new TeacherService();