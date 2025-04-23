const ApiError = require("../error/ApiError");
const { AcademicSpecialty, Op, Sequelize } = require("../models/index");

class AcademicSpecialtyService {
  async create(data) {
    try {
      const academicSpecialty = await AcademicSpecialty.create({
        code: data.code,
        name: data.name
      });
      
      return academicSpecialty;
    } catch (error) {
      throw ApiError.badRequest("Error creating academic specialty", error);
    }
  }

  async update(code, updateData) {
    try {
      const academicSpecialty = await AcademicSpecialty.findByPk(code);
      if (!academicSpecialty) {
        throw ApiError.notFound(`Academic specialty with code ${code} not found`);
      }
      
      await academicSpecialty.update({
        code: updateData.code,
        name: updateData.name
      });
      
      return academicSpecialty;
    } catch (error) {
      throw ApiError.badRequest("Error updating academic specialty", error);
    }
  }

  async getAll({
    page = 1,
    limit = 10,
    sortBy = "code",
    sortOrder = "ASC",
    query = {
      codeQuery: "",
      nameQuery: ""
    }
  }) {
    try {
      const offset = (page - 1) * limit;

      const where = {};

      if (query.codeQuery) {
        where.code = { [Op.iLike]: `%${query.codeQuery}%` };
      }

      if (query.nameQuery) {
        where.name = { [Op.iLike]: `%${query.nameQuery}%` };
      }

      const { count, rows } = await AcademicSpecialty.findAndCountAll({
        where,
        order: [[sortBy, sortOrder]],
        limit,
        offset,
        distinct: true
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
      throw ApiError.internal("Error fetching academic specialties: " + error.message);
    }
  }

  async delete(code) {
    try {
      const academicSpecialty = await AcademicSpecialty.findByPk(code);
      if (!academicSpecialty) {
        return null;
      }
      await academicSpecialty.destroy();
      return academicSpecialty;
    } catch (error) {
      throw ApiError.internal("Error deleting academic specialty: " + error.message);
    }
  }

  async getByCode(code) {
    try {
      const academicSpecialty = await AcademicSpecialty.findByPk(code);
      
      if (!academicSpecialty) {
        throw ApiError.notFound(`Academic specialty with code ${code} not found`);
      }
      
      return academicSpecialty;
    } catch (error) {
      throw ApiError.internal("Error fetching academic specialty: " + error.message);
    }
  }
}

module.exports = new AcademicSpecialtyService();