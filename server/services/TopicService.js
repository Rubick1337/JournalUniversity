// TopicService.js
const ApiError = require("../error/ApiError");
const { Topic, Subject, Op, Sequelize } = require("../models/index");

class TopicService {
  async create(data) {
    try {
      const topic = await Topic.create({
        name: data.name,
        subject_id: data.subjectId,
      });

      return await this._getTopicWithAssociations(topic.id);
    } catch (error) {
      throw ApiError.badRequest("Error creating topic", error);
    }
  }

  async update(topicId, updateData) {
    try {
      const topic = await Topic.findByPk(topicId);
      if (!topic) {
        throw ApiError.notFound(`Topic with ID ${topicId} not found`);
      }

      await topic.update({
        name: updateData.name,
        subject_id: updateData.subjectId,
      });

      return await this._getTopicWithAssociations(topicId);
    } catch (error) {
      throw ApiError.badRequest("Error updating topic", error);
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
                   subjectQuery: "", // Должен быть ID предмета, а не название
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
              Sequelize.cast(Sequelize.col("Topic.id"), "TEXT"),
              {
                [Op.iLike]: `%${query.idQuery}%`,
              }
          ),
        ];
      }

      const include = [
        {
          model: Subject,
          as: "subjectForTopic",
          attributes: ["id", "name"],
          required: !!query.subjectQuery,
          where: query.subjectQuery
              ? {
                id: query.subjectQuery // Ищем по ID, а не по имени
              }
              : undefined,
        },
      ];

      const { count, rows } = await Topic.findAndCountAll({
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
      throw ApiError.internal("Error fetching topics: " + error.message);
    }
  }

  async delete(topicId) {
    try {
      const topic = await Topic.findByPk(topicId);
      if (!topic) {
        return null;
      }
      await topic.destroy();
      return topic;
    } catch (error) {
      throw ApiError.internal("Error deleting topic: " + error.message);
    }
  }

  async getById(topicId) {
    try {
      const topic = await this._getTopicWithAssociations(topicId);

      if (!topic) {
        throw ApiError.notFound(`Topic with ID ${topicId} not found`);
      }

      return topic;
    } catch (error) {
      throw ApiError.internal("Error fetching topic: " + error.message);
    }
  }

  async _getTopicWithAssociations(topicId) {
    return await Topic.findByPk(topicId, {
      include: [
        {
          model: Subject,
          as: "subjectForTopic",
          attributes: ["id", "name"],
        },

      ],
    });
  }
}

module.exports = new TopicService();