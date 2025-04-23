const ApiError = require("../error/ApiError");
const {
  Curriculum,
  AcademicSpecialty,
  EducationForm,
  Op,
  Sequelize,
} = require("../models/index");

class CurriculumService {
  async create(data) {
    try {
      const curriculum = await Curriculum.create({
        year_of_specialty_training: data.year_of_specialty_training,
        specialty_code: data.specialty_code,
        education_form_id: data.education_form_id,
      });

      return await this._getCurriculumWithAssociations(curriculum.id);
    } catch (error) {
      throw ApiError.badRequest("Error creating curriculum", error);
    }
  }

  async update(curriculumId, updateData) {
    try {
      const curriculum = await Curriculum.findByPk(curriculumId);
      if (!curriculum) {
        throw ApiError.notFound(`Curriculum with ID ${curriculumId} not found`);
      }

      await curriculum.update({
        year_of_specialty_training: updateData.year_of_specialty_training,
        specialty_code: updateData.specialty_code,
        education_form_id: updateData.education_form_id,
      });

      return await this._getCurriculumWithAssociations(curriculumId);
    } catch (error) {
      throw ApiError.badRequest("Error updating curriculum", error);
    }
  }

  async getAll({
    page = 1,
    limit = 10,
    sortBy = "year_of_specialty_training",
    sortOrder = "ASC",
    query = {
      idQuery: "",
      yearQuery: "",
      specialtyQuery: "",
      educationFormQuery: "",
    },
  }) {
    try {
      const offset = (page - 1) * limit;

      const where = {};

      if (query.yearQuery) {
        where.year_of_specialty_training = {
          [Op.iLike]: `%${query.yearQuery}%`,
        };
      }

      if (query.idQuery) {
        where[Op.and] = [
          Sequelize.where(
            Sequelize.cast(Sequelize.col("Curriculum.id"), "TEXT"),
            {
              [Op.iLike]: `%${query.idQuery}%`,
            }
          ),
        ];
      }

      const include = [
        {
          model: AcademicSpecialty,
          as: "AcademicSpecialty",
          attributes: ["code", "name"],
          required: !!query.specialtyQuery,
          where: query.specialtyQuery
            ? {
                [Op.or]: [
                  { code: { [Op.iLike]: `%${query.specialtyQuery}%` } },
                  { name: { [Op.iLike]: `%${query.specialtyQuery}%` } },
                ],
              }
            : undefined,
        },
        {
          model: EducationForm,
          as: "EducationForm",
          attributes: ["id", "name"],
          required: !!query.educationFormQuery,
          where: query.educationFormQuery
            ? {
                name: { [Op.iLike]: `%${query.educationFormQuery}%` },
              }
            : undefined,
        },
      ];

      const { count, rows } = await Curriculum.findAndCountAll({
        where,
        include,
        order: [[sortBy, sortOrder]],
        limit,
        offset,
        distinct: true,
      });
      console.log("TESTT", rows[0])
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
      throw ApiError.internal("Error fetching curricula: " + error.message);
    }
  }

  async delete(curriculumId) {
    try {
      const curriculum = await Curriculum.findByPk(curriculumId);
      if (!curriculum) {
        return null;
      }
      await curriculum.destroy();
      return curriculum;
    } catch (error) {
      throw ApiError.internal("Error deleting curriculum: " + error.message);
    }
  }

  async getById(curriculumId) {
    try {
      const curriculum = await this._getCurriculumWithAssociations(
        curriculumId
      );

      if (!curriculum) {
        throw ApiError.notFound(`Curriculum with ID ${curriculumId} not found`);
      }

      return curriculum;
    } catch (error) {
      throw ApiError.internal("Error fetching curriculum: " + error.message);
    }
  }

  async _getCurriculumWithAssociations(curriculumId) {
    return await Curriculum.findByPk(curriculumId, {
      include: [
        {
          model: AcademicSpecialty,
          as: "AcademicSpecialty",
          attributes: ["code", "name"],
        },
        {
          model: EducationForm,
          as: "EducationForm",
          attributes: ["id", "name"],
        },
      ],
    });
  }
}

module.exports = new CurriculumService();
