const ApiError = require("../error/ApiError");
const { Subject, Department, Op, Sequelize } = require("../models/index");

class SubjectService {
  async create(data) {
    try {
      console.log(data);
      console.log('Используемые значения:', {
        name: data.name,
        department_id: data.department_id,
      });

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
      departmentIdQuery: null,
      departmentQuery: ""
    }
  }) {
    try {
      const offset = (page - 1) * limit;
      console.log("FEWF",query)
      
      const where = {};
  
      if (query.nameQuery) {
        where.name = { [Op.iLike]: `%${query.nameQuery}%` };
      }
      
      if (query.idQuery) {
        where[Op.and] = [
          Sequelize.where(
            Sequelize.cast(Sequelize.col("Subject.id"), "TEXT"),
            {
              [Op.iLike]: `%${query.idQuery}%`,
            }
          ),
        ];
      }
  
      // Добавляем условие для точного совпадения department_id
      if (query.departmentIdQuery) {
        where.department_id = query.departmentIdQuery;
      }
  
      const include = [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'name', 'full_name'],
          required: !!query.departmentQuery || !!query.departmentIdQuery,
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
        order: sortBy === 'department.name'
            ? [[{ model: Department, as: 'department' }, 'name', sortOrder]]
            : [[sortBy, sortOrder]],
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