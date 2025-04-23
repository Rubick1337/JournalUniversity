const ApiError = require("../error/ApiError");
const { AssessmentType, Op, Sequelize } = require("../models/index");

class AssessmentTypeService {
  async create(data) {
    try {
      const type = await AssessmentType.create({
        name: data.name,
      });

      return type;
    } catch (error) {
      throw ApiError.badRequest("Error creating assessment type", error);
    }
  }

  async update(typeId, updateData) {
    try {
      const type = await AssessmentType.findByPk(typeId);
      if (!type) {
        throw ApiError.notFound(
          `Assessment type with ID ${typeId} not found`
        );
      }

      await type.update({
        name: updateData.name,
      });

      return type;
    } catch (error) {
      throw ApiError.badRequest("Error updating assessment type", error);
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
            Sequelize.cast(Sequelize.col("AssessmentType.id"), "TEXT"),
            {
              [Op.iLike]: `%${query.idQuery}%`,
            }
          ),
        ];
      }

      const { count, rows } = await AssessmentType.findAndCountAll({
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
      throw ApiError.internal(
        "Error fetching assessment types: " + error.message
      );
    }
  }

  async delete(typeId) {
    try {
      const type = await AssessmentType.findByPk(typeId);
      if (!type) {
        return null;
      }
      await type.destroy();
      return type;
    } catch (error) {
      throw ApiError.internal(
        "Error deleting assessment type: " + error.message
      );
    }
  }

  async getById(typeId) {
    try {
      const type = await AssessmentType.findByPk(typeId);

      if (!type) {
        throw ApiError.notFound(
          `Assessment type with ID ${typeId} not found`
        );
      }

      return type;
    } catch (error) {
      throw ApiError.internal(
        "Error fetching assessment type: " + error.message
      );
    }
  }
}

module.exports = new AssessmentTypeService();