const ApiError = require("../error/ApiError");
const { AcademicSpecialty } = require("../models/index");
const { dbQuery } = require("../dbUtils");
const QUERIES = require("../queries/queries");
const { Sequelize } = require("../db");
const { Op, where, cast, col } = require("sequelize");

class AcademicSpecialtyService {
  create = async (dataForCreate) => {
    try {
      const result = await AcademicSpecialty.create({
        code: dataForCreate.code,
        name: dataForCreate.name,
      });
      return result;
    } catch (error) {
      throw error;
    }
  };

  getAll = async ({
    page = 1,
    limit = 10,
    sortBy = "code",
    sortOrder = "asc",
    query = { codeQuery: "", nameQuery: "" },
  }) => {

    const where = this.getWhere(query);
    const order = this.getSortOrder(
      AcademicSpecialty.rawAttributes,
      sortBy,
      sortOrder
    );

    page = Math.max(1, parseInt(page)) || 1;
    limit = Math.max(1, Math.min(parseInt(limit), 100)) || 10;

    const result = await AcademicSpecialty.findAndCountAll({
      where,
      order,
      limit,
      offset: (page - 1) * limit,
    });

    // Форматирование ответа
    return {
      data: result.rows,
      meta: {
        total: result.count,
        page,
        limit,
        totalPages: Math.ceil(result.count / limit),
      },
    };
  };
  /*
<===================================>
  Function
<===================================>
  */

  addLikeCondition = (field, value, whereConditions = {}) => {
    if (value !== null && value !== "") {
      const condition = Sequelize.where(
        Sequelize.cast(Sequelize.col(field), "TEXT"),
        {
          [Op.iLike]: `%${value}%`,
        }
      );
      if (whereConditions[Op.and]) {
        whereConditions[Op.and].push(condition);
      } else {
        whereConditions[Op.and] = [condition];
      }
    }
    return whereConditions;
  };
  getWhere = (query) => {
    let where = {};
    this.addLikeCondition("code", query.codeQuery, where);
    this.addLikeCondition("name", query.nameQuery, where);
    return where;
  };
  getSortOrder = (modelAttributes, sortBy, sortOrder = "ASC") => {
    const isValidSortField = modelAttributes.hasOwnProperty(sortBy);
    const normalizedSortOrder = ["ASC", "DESC"].includes(sortOrder)
      ? sortOrder
      : "ASC";

    return isValidSortField ? [[sortBy, normalizedSortOrder]] : [["id", "ASC"]];
  };
  delete = async (id) => {
    try {
      const result = await AcademicSpecialty.destroy({ where: { id } });
      if (result === 0) {
        throw ApiError.notFound("Academic specialty not found");
      }
      return result;
    } catch (error) {
      throw error;
    }
  };
}

module.exports = new AcademicSpecialtyService();
