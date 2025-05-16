// FacultyService.js
const ApiError = require("../error/ApiError");
const { Faculty, Person, Op, Sequelize } = require("../models/index");

class FacultyService {
  async create(data) {
    try {
      console.log('=== Данные для создания факультета ===');
      console.log('Исходные данные:', data);
      console.log('Используемые значения:', {
        name: data.name,
        full_name: data.full_name || data.fullName,
        dean_person_id: data.dean_person_id || data.deanPersonId
      });

      const faculty = await Faculty.create({
        name: data.name,
        full_name: data.full_name || data.fullName,
        dean_person_id: data.dean_person_id || data.deanPersonId || null
      });

      console.log('Создан факультет:', faculty.toJSON());
      return await this._getFacultyWithAssociations(faculty.id);
    } catch (error) {
      console.error('Ошибка создания факультета:', error);
      throw ApiError.badRequest("Error creating faculty", error);
    }
  }

  async update(facultyId, updateData) {
    try {
      console.log('Starting faculty update:', { facultyId, updateData });

      const faculty = await Faculty.findByPk(facultyId);
      if (!faculty) {
        console.error(`Faculty with ID ${facultyId} not found`);
        throw ApiError.notFound(`Faculty with ID ${facultyId} not found`);
      }

      console.log('Current faculty data:', faculty.toJSON());
      console.log('Update data:', updateData);

      const updatePayload = {
        name: updateData.name,
        full_name: updateData.fullName,
        dean_person_id: updateData.deanPersonId || updateData.deanPerson?.id
      };

      console.log('Prepared update payload:', updatePayload);

      await faculty.update(updatePayload);

      console.log('Faculty updated successfully');

      const result = await this._getFacultyWithAssociations(facultyId);
      console.log('Updated faculty with associations:', result);

      return result;
    } catch (error) {
      console.error('Error updating faculty:', error);
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

      // 1. Подготовка условий WHERE
      const where = {};
      console.log('Исходные параметры запроса:', { page, limit, sortBy, sortOrder, query });

      if (query.nameQuery) {
        where.name = { [Op.iLike]: `%${query.nameQuery}%` };
      }
      if (query.fullNameQuery) {
        where.full_name = { [Op.iLike]: `%${query.fullNameQuery}%` };
      }
      if (query.idQuery) {
        where[Op.and] = [
          Sequelize.where(
              Sequelize.cast(Sequelize.col("Faculty.id"), "TEXT"),
              { [Op.iLike]: `%${query.idQuery}%` }
          ),
        ];
      }

      // 2. Настройка включения ассоциации декана
      const include = [{
        model: Person,
        as: 'dean',
        attributes: ['id', 'surname', 'name', 'middlename'],
        required: false
      }];

      // 3. Дополнительные условия для поиска по декану
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

      console.log('Сформированные параметры запроса:', {
        where,
        include,
        order: [[sortBy, sortOrder]],
        limit,
        offset
      });

      // 4. Выполнение запроса
      const { count, rows } = await Faculty.findAndCountAll({
        where,
        include,
        order: [[sortBy, sortOrder]],
        limit,
        offset,
        distinct: true
      });

      // 5. Логирование результатов
      console.log('Результаты запроса:');
      console.log('Общее количество:', count);
      if (rows.length > 0) {
        console.log('Первая запись:', {
          id: rows[0].id,
          name: rows[0].name,
          dean_person_id: rows[0].dean_person_id,
          dean: rows[0].dean ? {
            id: rows[0].dean.id,
            name: rows[0].dean.name
          } : null
        });
      } else {
        console.log('Записи не найдены');
      }

      // 6. Возврат результатов
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
      console.error('Ошибка при получении факультетов:', {
        message: error.message,
        stack: error.stack,
        queryParams: { page, limit, sortBy, sortOrder, query }
      });
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