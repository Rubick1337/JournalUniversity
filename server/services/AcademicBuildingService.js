// AcademicBuildingService.js
const ApiError = require("../error/ApiError");
const { AcademicBuilding, Op, Sequelize } = require("../models/index");

class AcademicBuildingService {
  async create(data) {
    try {
      const building = await AcademicBuilding.create({
        name: data.name,
        address: data.address,
      });

      return building;
    } catch (error) {
      throw ApiError.badRequest("Error creating academic building", error);
    }
  }

  async update(buildingId, updateData) {
    try {
      const building = await AcademicBuilding.findByPk(buildingId);
      if (!building) {
        throw ApiError.notFound(
          `Academic building with ID ${buildingId} not found`
        );
      }

      await building.update({
        name: updateData.name,
        address: updateData.address,
      });

      return building;
    } catch (error) {
      throw ApiError.badRequest("Error updating academic building", error);
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
      addressQuery: "",
    },
  }) {
    try {
      const offset = (page - 1) * limit;

      const where = {};

      if (query.nameQuery) {
        where.name = { [Op.iLike]: `%${query.nameQuery}%` };
      }

      if (query.addressQuery) {
        where.address = { [Op.iLike]: `%${query.addressQuery}%` };
      }

      // idQuery с явным приведением типа
      if (query.idQuery) {
        where[Op.and] = [
          Sequelize.where(
            Sequelize.cast(Sequelize.col("AcademicBuilding.id"), "TEXT"),
            {
              [Op.iLike]: `%${query.idQuery}%`,
            }
          ),
        ];
      }

      const { count, rows } = await AcademicBuilding.findAndCountAll({
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
        "Error fetching academic buildings: " + error.message
      );
    }
  }

  async delete(buildingId) {
    try {
      const building = await AcademicBuilding.findByPk(buildingId);
      if (!building) {
        return null;
      }
      await building.destroy();
      return building;
    } catch (error) {
      throw ApiError.internal(
        "Error deleting academic building: " + error.message
      );
    }
  }

  async getById(buildingId) {
    try {
      const building = await AcademicBuilding.findByPk(buildingId);

      if (!building) {
        throw ApiError.notFound(
          `Academic building with ID ${buildingId} not found`
        );
      }

      return building;
    } catch (error) {
      throw ApiError.internal(
        "Error fetching academic building: " + error.message
      );
    }
  }
}

module.exports = new AcademicBuildingService();
