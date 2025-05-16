
// EducationFormService.js
const ApiError = require("../error/ApiError");
const { EducationForm, Op, Sequelize } = require("../models/index");

class EducationFormService {
  async create(data) {
    try {
      const form = await EducationForm.create({
        name: data.name,
      });

      return form;
    } catch (error) {
      throw ApiError.badRequest("Error creating education form", error);
    }
  }

  async update(formId, updateData) {
    try {
      const form = await EducationForm.findByPk(formId);
      if (!form) {
        throw ApiError.notFound(
          `Education form with ID ${formId} not found`
        );
      }

      await form.update({
        name: updateData.name,
      });

      return form;
    } catch (error) {
      throw ApiError.badRequest("Error updating education form", error);
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
            Sequelize.cast(Sequelize.col("EducationForm.id"), "TEXT"),
            {
              [Op.iLike]: `%${query.idQuery}%`,
            }
          ),
        ];
      }

      const { count, rows } = await EducationForm.findAndCountAll({
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
      throw ApiError.internal(
        "Error fetching education forms: " + error.message
      );
    }
  }

  async delete(formId) {
    try {
      const form = await EducationForm.findByPk(formId);
      if (!form) {
        return null;
      }
      await form.destroy();
      return form;
    } catch (error) {
      throw ApiError.internal(
        "Error deleting education form: " + error.message
      );
    }
  }

  async getById(formId) {
    try {
      const form = await EducationForm.findByPk(formId);

      if (!form) {
        throw ApiError.notFound(
          `Education form with ID ${formId} not found`
        );
      }

      return form;
    } catch (error) {
      throw ApiError.internal(
        "Error fetching education form: " + error.message
      );
    }
  }
}

module.exports = new EducationFormService();