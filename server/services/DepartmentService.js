const ApiError = require("../error/ApiError");
const { Department, Faculty, Person, Op, Sequelize } = require("../models/index");

class DepartmentService {
  async create(data) {
    try {
      const department = await Department.create({
        name: data.name,
        full_name: data.full_name,
        faculty_id: data.faculty_id,
        head_person_id: data.chairperson_of_the_department_person_id || null,
      });
      console.log("daswqwqd")
      console.log(data.chairperson_of_the_department_person_id );

      return await this._getDepartmentWithAssociations(department.id);
    } catch (error) {
      throw ApiError.badRequest("Error creating department", error);
    }
  }

  async update(departmentId, updateData) {
    try {
      const department = await Department.findByPk(departmentId);
      if (!department) {
        throw ApiError.notFound(`Department with ID ${departmentId} not found`);
      }

      // Поддерживаем оба варианта именования
      await department.update({
        name: updateData.name,
        full_name: updateData.full_name || updateData.fullName,
        faculty_id: updateData.faculty_id || updateData.facultyId,
        head_person_id: updateData.head_person_id ||
            updateData.chairperson_of_the_department_person_id ||
            updateData.headPersonId
      });

      return await this._getDepartmentWithAssociations(departmentId);
    } catch (error) {
      throw ApiError.badRequest("Error updating department", error);
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
      fullNameQuery: "",
      facultyQuery: "",
      headQuery: "",
    },
  }) {
    try {
      const offset = (page - 1) * limit;

      const where = {};

      if (query.nameQuery) {
        where.name = { [Op.iLike]: `%${query.nameQuery}%` };
      }
      if (query.fullNameQuery) {
        where.full_name = { [Op.iLike]: `%${query.fullNameQuery}%` };
      }
      // idQuery с явным приведением типа
      if (query.idQuery) {
        where[Op.and] = [
          Sequelize.where(
            Sequelize.cast(Sequelize.col("Department.id"), "TEXT"),
            {
              [Op.iLike]: `%${query.idQuery}%`,
            }
          ),
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
          model: Person,
          as: "head",
          attributes: ["id", "surname", "name", "middlename"],
          required: !!query.headQuery,
          where: query.headQuery
            ? {
                [Op.or]: [
                  { surname: { [Op.iLike]: `%${query.headQuery}%` } },
                  { name: { [Op.iLike]: `%${query.headQuery}%` } },
                  { middlename: { [Op.iLike]: `%${query.headQuery}%` } },
                ],
              }
            : undefined,
        },
      ];

      const { count, rows } = await Department.findAndCountAll({
        where,
        include,
        order: [[sortBy, sortOrder]],
        limit,
        offset,
        distinct: true,
      });
      console.log("TEST", rows);
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
      throw ApiError.internal("Error fetching departments: " + error.message);
    }
  }

  async delete(departmentId) {
    try {
      const department = await Department.findByPk(departmentId);
      if (!department) {
        return null;
      }
      await department.destroy();
      return department;
    } catch (error) {
      throw ApiError.internal("Error deleting department: " + error.message);
    }
  }

  async getById(departmentId) {
    try {
      const department = await this._getDepartmentWithAssociations(
        departmentId
      );

      if (!department) {
        throw ApiError.notFound(`Department with ID ${departmentId} not found`);
      }

      return department;
    } catch (error) {
      throw ApiError.internal("Error fetching department: " + error.message);
    }
  }

  async _getDepartmentWithAssociations(departmentId) {
    return await Department.findByPk(departmentId, {
      include: [
        {
          model: Faculty,
          as: "faculty",
          attributes: ["id", "name", "full_name"],
        },
        {
          model: Person,
          as: "head",
          attributes: ["id", "surname", "name", "middlename"],
        },
      ],
    });
  }
}

module.exports = new DepartmentService();
