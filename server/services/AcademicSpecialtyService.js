const ApiError = require("../error/ApiError");
const { AcademicSpecialty } = require("../models/index");
const { dbQuery } = require("../dbUtils");
const QUERIES = require("../queries/queries");
class AcademicSpecialtyService {
  getAcademicSpecialties = async () => {
    const params = [];
    const data = await dbQuery(QUERIES.GET_ACADEMIC_SPECIALTIES, params);
    const extractedData = Object.values(data[0])[0];
    return extractedData;
  };
  createAcademicSpecialty = async (dataForCreate) => {
    try {
      const result = await AcademicSpecialty.create({
        code: dataForCreate.code,
        name: dataForCreate.name,
      });
      return result;
    } catch (error) {
      this.handleSequelizeError(error);
    }
  };
  deleteAcademicSpecialties = async (id) =>{
    try {
      const result = await AcademicSpecialty.destroy({id});
      return result;
    } catch (error) {
      this.handleSequelizeError(error);
    }
  }
  // Метод для обработки ошибок Sequelize
  handleSequelizeError(error) {
    if (error.name === "Se  quelizeValidationError") {
      // Обработка ошибок валидации
      const errors = error.errors.map((err) => ({
        field: err.path, // Поле, которое не прошло валидацию
        message: err.message || "Ошибка валидации", // Используем кастомное сообщение
      }));
      throw ApiError.badRequest("Ошибка валидации", errors);
    } else if (error.name === "SequelizeUniqueConstraintError") {
      // Обработка ошибки уникальности
      const errors = error.errors.map((err) => {
        let message;
        if (err.path === "code") {
          message = "Такой код уже существует";
        } else if (err.path === "name") {
          message = "Такое название уже существует";
        } else {
          message = `Поле '${err.path}' должно быть уникальным`;
        }
        return {
          field: err.path,
          message: message,
        };
      });
      throw ApiError.badRequest("Ошибка уникальности", errors);
    } else {
      // Обработка других ошибок
      throw ApiError.internal(
        `Ошибка при выполнении запроса: ${error.message}`
      );
    }
  }
}

module.exports = new AcademicSpecialtyService();
