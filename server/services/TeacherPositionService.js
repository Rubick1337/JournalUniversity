const ApiError = require("../error/ApiError");
const { TeachingPosition, Op, Sequelize } = require("../models/index");

class TeacherPositionService {
  async create(data) {
    try {
      const position = await TeachingPosition.create({
        name: data.name,
      });

      return position;
    } catch (error) {
      throw ApiError.badRequest("Error creating teacher position", error);
    }
  }

  async update(positionId, updateData) {
    try {
      const position = await TeachingPosition.findByPk(positionId);
      if (!position) {
        throw ApiError.notFound(
          `Teacher position with ID ${positionId} not found`
        );
      }

      await position.update({
        name: updateData.name,
      });

      return position;
    } catch (error) {
      throw ApiError.badRequest("Error updating teacher position", error);
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

      // idQuery с явным приведением типа
      if (query.idQuery) {
        where[Op.and] = [
          Sequelize.where(
            Sequelize.cast(Sequelize.col("TeachingPosition.id"), "TEXT"),
            {
              [Op.iLike]: `%${query.idQuery}%`,
            }
          ),
        ];
      }

      const { count, rows } = await TeachingPosition.findAndCountAll({
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
        "Error fetching teacher positions: " + error.message
      );
    }
  }

  async delete(positionId) {
    try {
      const position = await TeachingPosition.findByPk(positionId);
      if (!position) {
        return null;
      }
      await position.destroy();
      return position;
    } catch (error) {
      throw ApiError.internal(
        "Error deleting teacher position: " + error.message
      );
    }
  }

  async getById(positionId) {
    try {
      const position = await TeachingPosition.findByPk(positionId);

      if (!position) {
        throw ApiError.notFound(
          `Teacher position with ID ${positionId} not found`
        );
      }

      return position;
    } catch (error) {
      throw ApiError.internal(
        "Error fetching teacher position: " + error.message
      );
    }
  }
}

module.exports = new TeacherPositionService();
