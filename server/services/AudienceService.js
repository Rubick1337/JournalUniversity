const ApiError = require("../error/ApiError");
const {
  Audience,
  AcademicBuilding,
  Op,
  Sequelize,
} = require("../models/index");

class AudienceService {
  async create(data) {
    try {
      const audience = await Audience.create({
        number: data.number,
        capacity: data.capacity,
        academic_building_id: data.academic_building_id,
      });

      return await this.getById(audience.id); // Возвращаем с включенным корпусом
    } catch (error) {
      throw ApiError.badRequest("Error creating audience", error);
    }
  }

  async update(audienceId, updateData) {
    try {
      const audience = await Audience.findByPk(audienceId);
      if (!audience) {
        throw ApiError.notFound(`Audience with ID ${audienceId} not found`);
      }

      await audience.update({
        number: updateData.number,
        capacity: updateData.capacity,
        academic_building_id: updateData.academic_building_id,
      });

      return await this.getById(audience.id); // Возвращаем с включенным корпусом
    } catch (error) {
      throw ApiError.badRequest("Error updating audience", error);
    }
  }

  async getAll({
    page = 1,
    limit = 10,
    sortBy = "number",
    sortOrder = "ASC",
    query = {
      idQuery: "",
      numberQuery: "",
      capacityQuery: "",
      buildingIdQuery: "",
      buildingNameQuery: "",
    },
  }) {
    try {
      const offset = (page - 1) * limit;

      const where = {};
      const include = [
        {
          model: AcademicBuilding,
          as: "academicBuilding",
          attributes: ["id", "name", "address"],
        },
      ];

      if (query.numberQuery) {
        where[Op.and] = [
          Sequelize.where(
            Sequelize.cast(Sequelize.col("Audience.number"), "TEXT"),
            {
              [Op.iLike]: `%${query.numberQuery}%`,
            }
          ),
        ];
      }

      if (query.capacityQuery) {
        where.capacity =query.capacityQuery;
      }

      // Фильтрация по ID корпуса
      if (query.buildingIdQuery) {
        include[0].where = {
          ...include[0].where,
          id: query.buildingIdQuery,
        };
      }

      // Фильтрация по названию корпуса
      if (query.buildingNameQuery) {
        include[0].where = {
          ...include[0].where,
          name: { [Op.iLike]: `%${query.buildingNameQuery}%` },
        };
      }

      // idQuery с явным приведением типа
      if (query.idQuery) {
        where[Op.and] = [
          Sequelize.where(
            Sequelize.cast(Sequelize.col("Audience.id"), "TEXT"),
            {
              [Op.iLike]: `%${query.idQuery}%`,
            }
          ),
        ];
      }

      const { count, rows } = await Audience.findAndCountAll({
        where,
        include,
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
      throw ApiError.internal("Error fetching audiences: " + error.message);
    }
  }

  async delete(audienceId) {
    try {
      const audience = await Audience.findByPk(audienceId);
      if (!audience) {
        return null;
      }
      await audience.destroy();
      return audience;
    } catch (error) {
      throw ApiError.internal("Error deleting audience: " + error.message);
    }
  }

  async getById(audienceId) {
    try {
      const audience = await Audience.findByPk(audienceId, {
        include: [
          {
            model: AcademicBuilding,
            as: "academicBuilding",
            attributes: ["id", "name", "address"],
          },
        ],
      });

      if (!audience) {
        throw ApiError.notFound(`Audience with ID ${audienceId} not found`);
      }

      return audience;
    } catch (error) {
      throw ApiError.internal("Error fetching audience: " + error.message);
    }
  }
}

module.exports = new AudienceService();
