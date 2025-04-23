// FacultyService.js
const ApiError = require("../error/ApiError");
const { Faculty, Person, Op, Sequelize } = require("../models/index");

class FacultyService {
  async create(data) {
    try {
      const faculty = await Faculty.create({
        name: data.name,
        full_name: data.fullName,
        dean_person_id: data.deanPersonId || null
      });
      
      return await this._getFacultyWithAssociations(faculty.id);
    } catch (error) {
      throw ApiError.badRequest("Error creating faculty", error);
    }
  }

  async update(facultyId, updateData) {
    try {
      const faculty = await Faculty.findByPk(facultyId);
      if (!faculty) {
        throw ApiError.notFound(`Faculty with ID ${facultyId} not found`);
      }
      
      await faculty.update({
        name: updateData.name,
        full_name: updateData.fullName,
        dean_person_id: updateData.deanPersonId
      });
      
      return await this._getFacultyWithAssociations(facultyId);
    } catch (error) {
      throw ApiError.badRequest("Error updating faculty", error);
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
      fullNameQuery: "",
      deanQuery: ""
    }
  }) {
    try {
      const offset = (page - 1) * limit;

      const where = {};

      if (query.nameQuery) {
        where.name = { [Op.iLike]: `%${query.nameQuery}%` };
      }
      if (query.fullNameQuery) {
        where.full_name = { [Op.iLike]: `%${query.fullNameQuery}%` };
      }
      // idQuery с явным приведением типа
      if (query.idQuery) {
        where[Op.and] = [
          Sequelize.where(
            Sequelize.cast(Sequelize.col("Faculty.id"), "TEXT"),
            {
              [Op.iLike]: `%${query.idQuery}%`,
            }
          ),
        ];
      }
      const include = [{
        model: Person,
        as: 'dean',
        attributes: ['id', 'surname', 'name', 'middlename'],
        required: false
      }];

      if (query.deanQuery) {
        include[0].where = {
          [Op.or]: [
            { surname: { [Op.iLike]: `%${query.deanQuery}%` }},
            { name: { [Op.iLike]: `%${query.deanQuery}%` }},
            { middlename: { [Op.iLike]: `%${query.deanQuery}%` }}
          ]
        };
        include[0].required = true;
      }

      const { count, rows } = await Faculty.findAndCountAll({
        where,
        include,
        order: [[sortBy, sortOrder]],
        limit,
        offset,
        distinct: true // Important for correct count when using includes
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
      throw ApiError.internal("Error fetching faculties: " + error.message);
    }
  }

  async delete(facultyId) {
    try {
      const faculty = await Faculty.findByPk(facultyId);
      if (!faculty) {
        return null;
      }
      await faculty.destroy();
      return faculty;
    } catch (error) {
      throw ApiError.internal("Error deleting faculty: " + error.message);
    }
  }

  async getById(facultyId) {
    try {
      const faculty = await this._getFacultyWithAssociations(facultyId);
      
      if (!faculty) {
        throw ApiError.notFound(`Faculty with ID ${facultyId} not found`);
      }
      
      return faculty;
    } catch (error) {
      throw ApiError.internal("Error fetching faculty: " + error.message);
    }
  }

  async _getFacultyWithAssociations(facultyId) {
    return await Faculty.findByPk(facultyId, {
      include: [{
        model: Person,
        as: 'dean',
        attributes: ['id', 'surname', 'name', 'middlename']
      }]
    });
  }
}

module.exports = new FacultyService();