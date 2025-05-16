const ApiError = require("../error/ApiError");
const { SubjectType, Op, Sequelize } = require("../models/index");

class SubjectTypeService {
  async create(data) {
    try {
      const subjectType = await SubjectType.create({
        name: data.name,
      });
      return subjectType;
    } catch (error) {
      throw ApiError.badRequest("Error creating subject type", error);
    }
  }

  async update(subjectTypeId, updateData) {
    try {
      const subjectType = await SubjectType.findByPk(subjectTypeId);
      if (!subjectType) {
        throw ApiError.notFound(`Subject type with ID ${subjectTypeId} not found`);
      }

      await subjectType.update({
        name: updateData.name,
      });

      return subjectType;
    } catch (error) {
      throw ApiError.badRequest("Error updating subject type", error);
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
          Sequelize.where(
            Sequelize.cast(Sequelize.col("SubjectType.id"), "TEXT"),
            {
              [Op.iLike]: `%${query.idQuery}%`,
            }
          ),
        ];
      }

      const { count, rows } = await SubjectType.findAndCountAll({
        where,
        order: [[sortBy, sortOrder]],
        limit,
        offset,
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
      throw ApiError.internal("Error fetching subject types: " + error.message);
    }
  }

  async delete(subjectTypeId) {
    try {
      const subjectType = await SubjectType.findByPk(subjectTypeId);
      if (!subjectType) {
        return null;
      }
      await subjectType.destroy();
      return subjectType;
    } catch (error) {
      throw ApiError.internal("Error deleting subject type: " + error.message);
    }
  }

  async getById(subjectTypeId) {
    try {
      const subjectType = await SubjectType.findByPk(subjectTypeId);

      if (!subjectType) {
        throw ApiError.notFound(`Subject type with ID ${subjectTypeId} not found`);
      }

      return subjectType;
    } catch (error) {
      throw ApiError.internal("Error fetching subject type: " + error.message);
    }
  }
}

module.exports = new SubjectTypeService();