const ApiError = require("../error/ApiError");
const { AcademicSpecialty } = require("../models/index");
const { dbQuery } = require("../dbUtils");
const QUERIES = require("../queries/queries");
const { body, validationResult } = require('express-validator');

class AcademicSpecialtyService {
  getAcademicSpecialties = async () => {
    const params = [];
    const data = await dbQuery(QUERIES.GET_ACADEMIC_SPECIALTIES, params);
    const extractedData = Object.values(data[0])[0];
    return extractedData;
  };

  // Валидация данных с помощью express-validator
  static validate(method) {
    switch (method) {
      case 'createAcademicSpecialty': {
        return [
          body('code')
            .exists().withMessage('Code is required')
            .isLength({ min: 3, max: 50 }).withMessage('Code must be between 3 and 50 characters')
            .trim()
            .escape(),
          body('name')
            .exists().withMessage('Name is required')
            .isLength({ min: 3, max: 255 }).withMessage('Name must be between 3 and 255 characters')
            .trim()
            .escape()
        ];
      }
    }
  }

  validateData = async(data) => {
    // Проверяем с помощью express-validator
    const errors = validationResult(data);
    if (!errors.isEmpty()) {
      throw ApiError.badRequest('Validation error', errors.array());
    }

    await this.validateCodeUniqueness(data.code);
    this.validateName(data.name);
  }

  validateCodeUniqueness = async(code) => {
    const existingSpecialty = await AcademicSpecialty.findOne({ where: { code } });
    if (existingSpecialty) {
      throw ApiError.badRequest('Academic specialty with this code already exists');
    }
  }

  validateName = (name) => {
    // Дополнительные проверки имени, если нужны
    if (typeof name !== 'string' || name.trim().length === 0) {
      throw ApiError.badRequest('Invalid name format');
    }
  }

  createAcademicSpecialty = async (dataForCreate) => {
    try {
      await this.validateData(dataForCreate);
      const result = await AcademicSpecialty.create({
        code: dataForCreate.code,
        name: dataForCreate.name,
      });
      return result;
    } catch (error) {
      throw error;
    }
  };

  deleteAcademicSpecialties = async (id) => {
    try {
      const result = await AcademicSpecialty.destroy({ where: { id } }); // Исправлено: добавлено where
      if (result === 0) {
        throw ApiError.notFound('Academic specialty not found');
      }
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AcademicSpecialtyService();