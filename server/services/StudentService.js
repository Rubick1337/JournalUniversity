const ApiError = require("../error/ApiError");
const { Student, Person, Group, Subgroup, Op, Sequelize } = require("../models/index");

class StudentService {
  async create(data) {
    try {
      console.log("Dasdasdasd");
      console.log(data);
      const student = await Student.create({
        count_reprimand: data.count_reprimand || 0,
        icon_path: data.icon_path || null,
        person_id: data.person_id,
        group_id: data.group_id,
        subgroup_id: data.subgroup_id,
        perent_person_id: data.perent_person_id || null,
      });

      return await this._getStudentWithAssociations(student.id);
    } catch (error) {
      throw ApiError.badRequest("Error creating student", error);
    }
  }

  async update(studentId, updateData) {
    try {
      const student = await Student.findByPk(studentId);
      if (!student) {
        throw ApiError.notFound(`Student with ID ${studentId} not found`);
      }

      await student.update({
        count_reprimand: updateData.count_reprimand || student.count_reprimand,
        icon_path: updateData.icon_path || student.icon_path,
        person_id: updateData.person_id || student.person_id,
        group_id: updateData.group_id || student.group_id,
        subgroup_id: updateData.subgroup_id || student.subgroup_id,
        perent_person_id: updateData.perent_person_id || student.perent_person_id,
      });

      return await this._getStudentWithAssociations(studentId);
    } catch (error) {
      throw ApiError.badRequest("Error updating student", error);
    }
  }

  async getAll({
    page = 1,
    limit = 10,
    sortBy = "person.surname",
    sortOrder = "ASC",
    query = {
      idQuery: "",
      surnameQuery: "",
      nameQuery: "",
      groupQuery: "",
      subgroupQuery: "",
      parentQuery: "",
      reprimandQuery: ""
    },
  }) {
    try {
      const offset = (page - 1) * limit;
  
      const where = {};
  
      if (query.reprimandQuery) {
        where.count_reprimand = { [Op.eq]: parseInt(query.reprimandQuery) };
      }
      
      if (query.idQuery) {
        where[Op.and] = [
          Sequelize.where(
            Sequelize.cast(Sequelize.col("Student.id"), "TEXT"),
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
          required: true,
          where: {
            [Op.and]: [
              query.surnameQuery ? { surname: { [Op.iLike]: `%${query.surnameQuery}%` } } : {},
              query.nameQuery ? { name: { [Op.iLike]: `%${query.nameQuery}%` } } : {},
            ]
          }
        },
        {
          model: Group,
          as: "group",
          attributes: ["id", "name"],
          required: !!query.groupQuery,
          where: query.groupQuery
            ? { name: { [Op.iLike]: `%${query.groupQuery}%` }}
            : undefined,
        },
        {
          model: Subgroup,
          as: "subgroup",
          attributes: ["id", "name"],
          required: !!query.subgroupQuery,
          where: query.subgroupQuery
            ? { name: { [Op.iLike]: `%${query.subgroupQuery}%` }}
            : undefined,
        },
        {
          model: Person,
          as: "perent",
          attributes: ["id", "surname", "name", "middlename"],
          required: !!query.parentQuery,
          where: query.parentQuery
            ? {
                [Op.or]: [
                  { surname: { [Op.iLike]: `%${query.parentQuery}%` } },
                  { name: { [Op.iLike]: `%${query.parentQuery}%` } },
                  { middlename: { [Op.iLike]: `%${query.parentQuery}%` } },
                ],
              }
            : undefined,
        },
      ];
  
      // Fix for sorting - handle nested properties properly
      let order;
      if (sortBy.includes('.')) {
        const [association, field] = sortBy.split('.');
        order = [[{ model: this._getModelForAssociation(association), as: association }, field, sortOrder]];
      } else {
        order = [[sortBy, sortOrder]];
      }
  
      const { count, rows } = await Student.findAndCountAll({
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
      throw ApiError.internal("Error fetching students: " + error.message);
    }
  }
  
  // Helper method to get the correct model for an association
  _getModelForAssociation(association) {
    switch (association) {
      case 'person':
      case 'perent':
        return Person;
      case 'group':
        return Group;
      case 'subgroup':
        return Subgroup;
      default:
        return Student;
    }
  }

  async delete(studentId) {
    try {
      const student = await Student.findByPk(studentId);
      if (!student) {
        return null;
      }
      await student.destroy();
      return student;
    } catch (error) {
      throw ApiError.internal("Error deleting student: " + error.message);
    }
  }

  async getById(studentId) {
    try {
      const student = await this._getStudentWithAssociations(studentId);

      if (!student) {
        throw ApiError.notFound(`Student with ID ${studentId} not found`);
      }

      return student;
    } catch (error) {
      throw ApiError.internal("Error fetching student: " + error.message);
    }
  }

  async _getStudentWithAssociations(studentId) {
    return await Student.findByPk(studentId, {
      include: [
        {
          model: Person,
          as: "person",
          attributes: ["id", "surname", "name", "middlename", "phone_number", "email"],
        },
        {
          model: Group,
          as: "group",
          attributes: ["id", "name"],
        },
        {
          model: Subgroup,
          as: "subgroup",
          attributes: ["id", "name"],
        },
        {
          model: Person,
          as: "perent",
          attributes: ["id", "surname", "name", "middlename", "phone_number", "email"],
        },
      ],
    });
  }
}

module.exports = new StudentService();