const ApiError = require("../error/ApiError");
const { TypeOfSemester, Op, Sequelize } = require("../models/index");

class TypeOfSemesterService {
  async create(data) {
    try {
      const typeOfSemester = await TypeOfSemester.create({
        name: data.name,
        start: data.start,
        end: data.end,
      });

      return typeOfSemester;
    } catch (error) {
      throw ApiError.badRequest("Error creating type of semester", error);
    }
  }

  async update(typeOfSemesterId, updateData) {
    try {
      const typeOfSemester = await TypeOfSemester.findByPk(typeOfSemesterId);
      if (!typeOfSemester) {
        throw ApiError.notFound(
          `Type of semester with ID ${typeOfSemesterId} not found`
        );
      }

      await typeOfSemester.update({
        name: updateData.name,
        start: updateData.start,
        end: updateData.end,
      });

      return typeOfSemester;
    } catch (error) {
      throw ApiError.badRequest("Error updating type of semester", error);
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
      startDateQuery: "",
      endDateQuery: "",
    },
  }) {
    try {
      const offset = (page - 1) * limit;

      const where = {};

      if (query.nameQuery) {
        where.name = { [Op.iLike]: `%${query.nameQuery}%` };
      }

      if (query.startDateQuery) {
        where.start = { [Op.gte]: new Date(query.startDateQuery) };
      }

      if (query.endDateQuery) {
        where.end = { [Op.lte]: new Date(query.endDateQuery) };
      }

      // idQuery с явным приведением типа
      if (query.idQuery) {
        where[Op.and] = [
          Sequelize.where(
            Sequelize.cast(Sequelize.col("TypeOfSemester.id"), "TEXT"),
            {
              [Op.iLike]: `%${query.idQuery}%`,
            }
          ),
        ];
      }

      const { count, rows } = await TypeOfSemester.findAndCountAll({
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
        "Error fetching types of semester: " + error.message
      );
    }
  }

  async delete(typeOfSemesterId) {
    try {
      const typeOfSemester = await TypeOfSemester.findByPk(typeOfSemesterId);
      if (!typeOfSemester) {
        return null;
      }
      await typeOfSemester.destroy();
      return typeOfSemester;
    } catch (error) {
      throw ApiError.internal(
        "Error deleting type of semester: " + error.message
      );
    }
  }

  async getById(typeOfSemesterId) {
    try {
      const typeOfSemester = await TypeOfSemester.findByPk(typeOfSemesterId);

      if (!typeOfSemester) {
        throw ApiError.notFound(
          `Type of semester with ID ${typeOfSemesterId} not found`
        );
      }

      return typeOfSemester;
    } catch (error) {
      throw ApiError.internal(
        "Error fetching type of semester: " + error.message
      );
    }
  }
}

module.exports = new TypeOfSemesterService();