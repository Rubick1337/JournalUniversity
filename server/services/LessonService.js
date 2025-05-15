const ApiError = require("../error/ApiError");
const { 
  Lesson, 
  Group, 
  Subgroup, 
  Subject, 
  Teacher, 
  Topic, 
  Audience, 
  SubjectType,
  Person,
  TeachingPosition,
  Pair,
  Op, 
  Sequelize 
} = require("../models/index");

class LessonService {
  async create(data) {
    try {
      const lesson = await Lesson.create({
        group_id: data.group_id,
        pair_id: data.pair_id,
        subgroup_id: data.subgroup_id || null,
        date: data.date,
        subject_id: data.subject_id,
        teacher_person_id: data.teacher_person_id,
        topic_id: data.topic_id,
        audience_id: data.audience_id,
        subject_type_id: data.subject_type_id,
        has_marked_absences: data.has_marked_absences || false
      });

      return await this._getLessonWithAssociations(lesson.id);
    } catch (error) {
      throw ApiError.badRequest("Error creating lesson", error);
    }
  }

  async update(lessonId, updateData) {
    try {
      const lesson = await Lesson.findByPk(lessonId);
      if (!lesson) {
        throw ApiError.notFound(`Lesson with ID ${lessonId} not found`);
      }

      await lesson.update({
        group_id: updateData.group_id,
        subgroup_id: updateData.subgroup_id || null,
        date: updateData.date,
        subject_id: updateData.subject_id,
        teacher_person_id: updateData.teacher_person_id,
        topic_id: updateData.topic_id,
        audience_id: updateData.audience_id,
        subject_type_id: updateData.subject_type_id,
        has_marked_absences: updateData.has_marked_absences
      });

      return await this._getLessonWithAssociations(lessonId);
    } catch (error) {
      throw ApiError.badRequest("Error updating lesson", error);
    }
  }

  async getAll({
    page = 1,
    limit = 10,
    sortBy = "date",
    sortOrder = "ASC",
    query = {
      idQuery: "",
      groupQuery: "",
      subgroupQuery: "",
      subjectQuery: "",
      teacherQuery: "",
      topicQuery: "",
      audienceQuery: "",
      subjectTypeQuery: "",
      dateFrom: "",
      dateTo: "",
      teachingPositionQuery: "",
      pairQuery: ""
    },
  }) {
    try {
      const offset = (page - 1) * limit;

      const where = {};

      // Date range filtering
      if (query.dateFrom || query.dateTo) {
        where.date = {};
        if (query.dateFrom) where.date[Op.gte] = new Date(query.dateFrom);
        if (query.dateTo) where.date[Op.lte] = new Date(query.dateTo);
      }

      // ID query
      if (query.idQuery) {
        where[Op.and] = [
          Sequelize.where(
            Sequelize.cast(Sequelize.col("Lesson.id"), "TEXT"),
            {
              [Op.iLike]: `%${query.idQuery}%`,
            }
          ),
        ];
      }

      const include = [
        {
          model: Group,
          as: "GroupForLesson",
          // attributes: ["id", "name"],
          required: !!query.groupQuery,
          where: query.groupQuery
            ? { name: { [Op.iLike]: `%${query.groupQuery}%` } }
            : undefined
        },
        {
          model: Subgroup,
          as: "SubgroupForLesson",
          // attributes: ["id", "name"],
          required: !!query.subgroupQuery,
          where: query.subgroupQuery
            ? { name: { [Op.iLike]: `%${query.subgroupQuery}%` } }
            : undefined
        },
        {
          model: Subject,
          as: "SubjectForLesson",
          // attributes: ["id", "name"],
          required: !!query.subjectQuery,
          where: query.subjectQuery
            ? { name: { [Op.iLike]: `%${query.subjectQuery}%` } }
            : undefined
        },
        {
          model: Teacher,
          as: "TeacherForLesson",
          include: [
            {
              model: Person,
              as: "person",
              // attributes: ["id", "surname", "name", "middlename"],
            },
            {
              model: TeachingPosition,
              as: "teachingPosition",
              // attributes: ["id", "name"],
              required: !!query.teachingPositionQuery,
              where: query.teachingPositionQuery
                ? { name: { [Op.iLike]: `%${query.teachingPositionQuery}%` } }
                : undefined
            }
          ],
          required: !!query.teacherQuery || !!query.teachingPositionQuery,
          where: query.teacherQuery
            ? {
                '$person.surname$': { [Op.iLike]: `%${query.teacherQuery}%` }
              }
            : undefined
        },
        {
          model: Topic,
          as: "TopicForLesson",
          // attributes: ["id", "name"],
          required: !!query.topicQuery,
          where: query.topicQuery
            ? { name: { [Op.iLike]: `%${query.topicQuery}%` } }
            : undefined
        },
        {
          model: Audience,
          as: "AudienceForLesson",
          // attributes: ["id", "number"],
          required: !!query.audienceQuery,
          where: query.audienceQuery
            ? { number: { [Op.iLike]: `%${query.audienceQuery}%` } }
            : undefined
        },
        {
          model: SubjectType,
          as: "SubjectTypeForLesson",
          // attributes: ["id", "name"],
          required: !!query.subjectTypeQuery,
          where: query.subjectTypeQuery
            ? { name: { [Op.iLike]: `%${query.subjectTypeQuery}%` } }
            : undefined
        },
        {
          model: Pair,
          as: "PairForLesson",
          // attributes: ["id", "name", "start_time", "end_time"],
          required: !!query.pairQuery,
          where: query.pairQuery
            ? {
                [Op.or]: [
                  { number: { [Op.iLike]: `%${query.pairQuery}%` } },
                  { start_time: { [Op.iLike]: `%${query.pairQuery}%` } },
                  { end_time: { [Op.iLike]: `%${query.pairQuery}%` } }
                ]
              }
            : undefined
        }
      ];

      const { count, rows } = await Lesson.findAndCountAll({
        where,
        include,
        order: [[sortBy, sortOrder]],
        limit,
        offset,
        distinct: true,
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
      throw ApiError.internal("Error fetching lessons: " + error.message);
    }
  }

  async delete(lessonId) {
    try {
      const lesson = await Lesson.findByPk(lessonId);
      if (!lesson) {
        return null;
      }
      await lesson.destroy();
      return lesson;
    } catch (error) {
      throw ApiError.internal("Error deleting lesson: " + error.message);
    }
  }

  async getById(lessonId) {
    try {
      const lesson = await this._getLessonWithAssociations(lessonId);

      if (!lesson) {
        throw ApiError.notFound(`Lesson with ID ${lessonId} not found`);
      }

      return lesson;
    } catch (error) {
      throw ApiError.internal("Error fetching lesson: " + error.message);
    }
  }

  async _getLessonWithAssociations(lessonId) {
    return await Lesson.findByPk(lessonId, {
      include: [
        {
          model: Group,
          as: "GroupForLesson",
          // attributes: ["id", "name"]
        },
        {
          model: Subgroup,
          as: "SubgroupForLesson",
          // attributes: ["id", "name"]
        },
        {
          model: Subject,
          as: "SubjectForLesson",
          // attributes: ["id", "name"]
        },
        {
          model: Teacher,
          as: "TeacherForLesson",
          include: [
            {
              model: Person,
              as: "person",
              // attributes: ["id", "surname", "name", "middlename"]
            },
            {
              model: TeachingPosition,
              as: "teachingPosition",
              // attributes: ["id", "name"]
            }
          ]
        },
        {
          model: Topic,
          as: "TopicForLesson",
          // attributes: ["id", "name"]
        },
        {
          model: Audience,
          as: "AudienceForLesson",
          // attributes: ["id", "number"]
        },
        {
          model: SubjectType,
          as: "SubjectTypeForLesson",
          // attributes: ["id", "name"]
        },
        {
          model: Pair,
          as: "PairForLesson",
          // attributes: ["id", "name", "start"]
        }
      ]
    });
  }
}

module.exports = new LessonService();