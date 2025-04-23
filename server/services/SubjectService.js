const ApiError = require("../error/ApiError");
const { Subject, Department, Op } = require("../models/index");

class SubjectService {
  async create(data) {
    try {
      const subject = await Subject.create({
        name: data.name,
        department_id: data.department_id
      });
      
      return await this._getSubjectWithAssociations(subject.id);
    } catch (error) {
      throw ApiError.badRequest("Error creating subject", error);
    }
  }

  async update(subjectId, updateData) {
    try {
      const subject = await Subject.findByPk(subjectId);
      if (!subject) {
        throw ApiError.notFound(`Subject with ID ${subjectId} not found`);
      }
      
      await subject.update({
        name: updateData.name,
        department_id: updateData.department_id
      });
      
      return await this._getSubjectWithAssociations(subjectId);
    } catch (error) {
      throw ApiError.badRequest("Error updating subject", error);
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
      departmentQuery: ""
    }
  }) {
    try {
      const offset = (page - 1) * limit;

      const where = {};
      if (query.idQuery) {
        where.id = {
          [Op.like]: `%${query.idQuery}%`,
        };
      }
      if (query.nameQuery) {
        where.name = { [Op.iLike]: `%${query.nameQuery}%` };
      }

      const include = [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'name', 'full_name'],
          required: !!query.departmentQuery,
          where: query.departmentQuery ? {
            [Op.or]: [
              { name: { [Op.iLike]: `%${query.departmentQuery}%` }},
              { full_name: { [Op.iLike]: `%${query.departmentQuery}%` }}
            ]
          } : undefined
        }
      ];

      const { count, rows } = await Subject.findAndCountAll({
        where,
        include,
        order: [[sortBy, sortOrder]],
        limit,
        offset,
        distinct: true
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
      throw ApiError.internal("Error fetching subjects: " + error.message);
    }
  }

  async delete(subjectId) {
    try {
      const subject = await Subject.findByPk(subjectId);
      if (!subject) {
        return null;
      }
      await subject.destroy();
      return subject;
    } catch (error) {
      throw ApiError.internal("Error deleting subject: " + error.message);
    }
  }

  async getById(subjectId) {
    try {
      const subject = await this._getSubjectWithAssociations(subjectId);
      
      if (!subject) {
        throw ApiError.notFound(`Subject with ID ${subjectId} not found`);
      }
      
      return subject;
    } catch (error) {
      throw ApiError.internal("Error fetching subject: " + error.message);
    }
  }

  async _getSubjectWithAssociations(subjectId) {
    return await Subject.findByPk(subjectId, {
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'name', 'full_name']
        }
      ]
    });
  }
}

module.exports = new SubjectService();