// GroupService.js
const ApiError = require("../error/ApiError");
const {
  Group,
  Faculty,
  Department,
  AcademicSpecialty,
  Person,
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
}

module.exports = new GroupService();
