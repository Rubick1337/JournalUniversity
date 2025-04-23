const ApiError = require("../error/ApiError");
const { Person, Op } = require("../models/index");

class PersonService {
  async create(data) {
    try {
      return await Person.create(data);
    } catch (error) {
      throw ApiError.badRequest("Ошибка при создании пользователя", error);
    }
  }

  async update(personId, updateData) {
    const person = await Person.findByPk(personId);
    if (!person) {
      throw ApiError.notFound(`Person with ID ${personId} not found`);
    }
    return await person.update(updateData);
  }

  async getAll({
    page = 1,
    limit = 10,
    sortBy = "id",
    sortOrder = "ASC",
    query = {
      idQuery: "",
      surnameQuery: "",
      nameQuery: "",
      middlenameQuery: "",
      phoneNumberQuery: "",
      emailQuery: "",
    },
  }) {
    try {
      const offset = (page - 1) * limit;

      const where = {};
      if (query.idQuery) {
        where.id = {
          [Op.like]: `%${query.idQuery}%`,
        };
      }
      if (query.surnameQuery)
        where.surname = { [Op.iLike]: `%${query.surnameQuery}%` };
      if (query.nameQuery) where.name = { [Op.iLike]: `%${query.nameQuery}%` };
      if (query.middlenameQuery)
        where.middlename = { [Op.iLike]: `%${query.middlenameQuery}%` };
      if (query.phoneNumberQuery)
        where.phoneNumber = { [Op.iLike]: `%${query.phoneNumberQuery}%` };
      if (query.emailQuery)
        where.email = { [Op.iLike]: `%${query.emailQuery}%` };

      const { count, rows } = await Person.findAndCountAll({
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
      throw ApiError.internal("Ошибка при получении данных: " + error.message);
    }
  }

  async delete(personId) {
    const person = await Person.findByPk(personId);
    if (!person) return null;
    await person.destroy();
    return person;
  }

  async getById(personId) {
    return await Person.findByPk(personId);
  }

  async getDataForSelect() {
    return await Person.findAll({
      attributes: ["id", ["surname", "label"]], // или другие поля для select
      order: [["surname", "ASC"]],
    });
  }
}

module.exports = new PersonService();
