const ApiError = require("../error/ApiError");
const { Subject } = require("../models/index");
const { dbQuery } = require("../dbUtils");
const QUERIES = require("../queries/queries");
class FacultyServer {
  getAll = async () => {
    try {
      const params = [];
      const data = await dbQuery(
        QUERIES.FACULTY.GET_ALL_FACULTY_WITH_FULL_DATA,
        params
      );
      const extractedData = Object.values(data[0])[0];
      return extractedData;
    } catch (err) {
      throw err;
    }
  };
  getById = async (faculty_id) => {
    try {
      const params = [faculty_id];
      const data = await dbQuery(QUERIES.FACULTY.GET_BY_ID_GULL_DATA, params);
      const extractedData = Object.values(data[0])[0];
      return extractedData;
    } catch (err) {
      throw err;
    }
  };
  create = async (data) => {
    try {
      //TODO validate data
      const result = await Faculty.create({
        name: data.name,
        full_name: data.fullName,
        dean_person_id: data.deanPerson.id,
      });
      return result.dataValues;
    } catch (err) {
      throw err;
    }
  };
  update = async (id, data) => {
    try {
      //TODO validate id
      //TODO validate data
      const [affectedCount, updatedFaculty] = await Faculty.update(
        {
          name: data.name,
          full_name: data.fullName,
          dean_person_id: data.deanPerson?.id || null,
        },
        {
          where: { id }, // Фикс: должен быть объект условия
          returning: true, // Для PostgreSQL возвращает обновленную запись
        }
      );
  
      if (affectedCount === 0) {
        throw ApiError.badRequest('Faculty not found or no changes made');
      }
  
      return updatedFaculty[0].get();
    } catch (err) {
      throw err;
    }
  };
  delete = async (id) => {
    try {
      //TODO valudate id

      const deletedCount = await Faculty.destroy({
        where: { id },
        limit: 1 // Гарантируем удаление только одной записи
      });
  
      if (deletedCount === 0) {
        throw ApiError.badRequest('Faculty deletion failed');
      }
  
      return { 
        success: true,
        id: id,
        message: 'Faculty deleted successfully'
      };
    } catch (err) {
      throw err;
    }
  };
}

module.exports = new FacultyServer();
