const ApiError = require("../error/ApiError");
const { Person } = require("../models/index");
const { dbQuery } = require("../dbUtils");
const QUERIES = require("../queries/queries");
class PersonService {
  create = async (data) => {
    try {
      const result = await Person.create(data);
      return result;
    } catch (error) {
      console.error(error);
      throw ApiError.badRequest("Error", error);
    }
  };

  getDataForSelect = async () => {
    const params = [];
    const data = await dbQuery(QUERIES.GET_PEOPLE_DATA_FOR_SELECT, params);
    const extractedData = Object.values(data[0])[0];
    return extractedData;
  };
  async getAll({
    page = 1,
    limit = 10,
    sortBy = "id",
    sortOrder = "ASC",
    query = {
      surnameQuery: "",
      nameQuery: "",
      middlenameQuery: "",
      phoneNumberQuery: "",
      emailQuery: "",
    },
  }) {
    try {
      const params = [
        limit,
        page,
        sortBy,
        sortOrder,
        query.surnameQuery || null,
        query.nameQuery || null,
        query.middlenameQuery || null,
        query.phoneNumberQuery || null,
        query.emailQuery || null,
      ];

      // Вызываем функцию из PostgreSQL
      const result = await dbQuery(QUERIES.PEOPLE.GET_ALL, params);

      // Извлекаем данные из результата
      const fullResult = result[0].get_all_person_full_data;

      if (!fullResult) {
        throw ApiError.internal("Ошибка при получении данных");
      }

      // Парсим JSON результат
      const parsedResult =
        typeof fullResult === "string" ? JSON.parse(fullResult) : fullResult;
      console.log("TEST", parsedResult);
      return {
        data: parsedResult.data || [],
        meta: parsedResult.meta || {
          currentPage: page,
          perPage: limit,
          totalItems: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    } catch (error) {
      throw ApiError.internal("Ошибка при получении данных: " + error.message);
    }
  }
  delete = async (personId) => {
    
    const person = await Person.findByPk(personId );
    console.log("TETTTT", person)

    if (!person) return null;
    await person.destroy();
    return person;
  };
  getById = async (personId) => {
    return await Specialty.findByPk({ id: personId });
  };
}

module.exports = new PersonService();
