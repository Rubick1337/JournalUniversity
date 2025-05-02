// services/SubgroupService.js
const ApiError = require("../error/ApiError");
const { Subgroup, Group, Person, Op, Sequelize } = require("../models/index");

class SubgroupService {
  async create(data) {
    try {
      const subgroup = await Subgroup.create({
        name: data.name,
        group_id: data.group_id,
        leader_id: data.leader_id || null,
      });

      return await this._getSubgroupWithAssociations(subgroup.id);
    } catch (error) {
      throw ApiError.badRequest("Error creating subgroup", error);
    }
  }

  async update(subgroupId, updateData) {
    try {
      const subgroup = await Subgroup.findByPk(subgroupId);
      if (!subgroup) {
        throw ApiError.notFound(`Subgroup with ID ${subgroupId} not found`);
      }

      await subgroup.update({
        name: updateData.name,
        group_id: updateData.group_id || updateData.groupId,
        leader_id: updateData.leader_id || updateData.leaderId || null
      });

      return await this._getSubgroupWithAssociations(subgroupId);
    } catch (error) {
      throw ApiError.badRequest("Error updating subgroup", error);
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
      groupQuery: "",
      leaderQuery: "",
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
            Sequelize.cast(Sequelize.col("Subgroup.id"), "TEXT"),
            {
              [Op.iLike]: `%${query.idQuery}%`,
            }
          ),
        ];
      }

      const include = [
        {
          model: Group,
          as: "group",
          attributes: ["id", "name"],
          required: !!query.groupQuery,
          where: query.groupQuery
            ? {
                name: { [Op.iLike]: `%${query.groupQuery}%` }
              }
            : undefined,
        },
        {
          model: Person,
          as: "leader",
          attributes: ["id", "surname", "name", "middlename"],
          required: !!query.leaderQuery,
          where: query.leaderQuery
            ? {
                [Op.or]: [
                  { surname: { [Op.iLike]: `%${query.leaderQuery}%` } },
                  { name: { [Op.iLike]: `%${query.leaderQuery}%` } },
                  { middlename: { [Op.iLike]: `%${query.leaderQuery}%` } },
                ],
              }
            : undefined,
        },
      ];

      const { count, rows } = await Subgroup.findAndCountAll({
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
      throw ApiError.internal("Error fetching subgroups: " + error.message);
    }
  }

  async delete(subgroupId) {
    try {
      const subgroup = await Subgroup.findByPk(subgroupId);
      if (!subgroup) {
        return null;
      }
      await subgroup.destroy();
      return subgroup;
    } catch (error) {
      throw ApiError.internal("Error deleting subgroup: " + error.message);
    }
  }

  async getById(subgroupId) {
    try {
      const subgroup = await this._getSubgroupWithAssociations(subgroupId);

      if (!subgroup) {
        throw ApiError.notFound(`Subgroup with ID ${subgroupId} not found`);
      }

      return subgroup;
    } catch (error) {
      throw ApiError.internal("Error fetching subgroup: " + error.message);
    }
  }

  async _getSubgroupWithAssociations(subgroupId) {
    return await Subgroup.findByPk(subgroupId, {
      include: [
        {
          model: Group,
          as: "group",
          attributes: ["id", "name"],
        },
        {
          model: Person,
          as: "leader",
          attributes: ["id", "surname", "name", "middlename"],
        },
      ],
    });
  }
}

module.exports = new SubgroupService();