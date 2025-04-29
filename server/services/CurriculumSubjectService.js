const ApiError = require("../error/ApiError");
const {
  CurriculumSubject,
  Curriculum,
  Subject,
  AssessmentType,
  AcademicSpecialty,  // Добавьте эту строку
  Op,
  Sequelize,
} = require("../models/index");
class CurriculumSubjectService {
  async create(curriculumId, data) {
    try {
      const curriculumSubject = await CurriculumSubject.create({
        curriculum_id: curriculumId,
        subject_id: data.subject_id,
        assessment_type_id: data.assessment_type_id,
        semester: data.semester,
        all_hours: data.all_hours,
        lecture_hours: data.lecture_hours,
        lab_hours: data.lab_hours,
        practice_hours: data.practice_hours,
      });

      return await this._getCurriculumSubjectWithAssociations(
        curriculumId,
        data.subject_id,
        data.assessment_type_id,
        data.semester
      );
    } catch (error) {
      throw ApiError.badRequest("Error creating curriculum subject", error);
    }
  }

  async update(compositeId, updateData) {
    try {
      const curriculumSubject = await CurriculumSubject.findOne({
        where: {
          curriculum_id: compositeId.curriculumId,
          subject_id: compositeId.subjectId,
          assessment_type_id: compositeId.assessmentTypeId,
          semester: compositeId.semester,
        },
      });

      if (!curriculumSubject) {
        throw ApiError.notFound(
          `Curriculum subject with specified composite id not found`
        );
      }

      await curriculumSubject.update({
        all_hours: updateData.all_hours,
        lecture_hours: updateData.lecture_hours,
        lab_hours: updateData.lab_hours,
        practice_hours: updateData.practice_hours,
      });

      return await this._getCurriculumSubjectWithAssociations(
        compositeId.curriculumId,
        compositeId.subjectId,
        compositeId.assessmentTypeId,
        compositeId.semester
      );
    } catch (error) {
      throw ApiError.badRequest("Error updating curriculum subject", error);
    }
  }

  async getAll({
    curriculumId,
    page = 1,
    limit = 10,
    sortBy = "semester",
    sortOrder = "ASC",
    query = {
      curriculumQuery: "",
      subjectQuery: "",
      assessmentTypeQuery: "",
      semesterQuery: "",
    },
  }) {
    try {
      const offset = (page - 1) * limit;

      const where = {};

      if (curriculumId) {
        where.curriculum_id = curriculumId;
      }

      // if (query.semesterQuery) {
      //   where.semester = {
      //     [Op.eq]: query.semesterQuery,
      //   };
      // }

      // if (query.curriculumQuery) {
      //   where[Op.and] = [
      //     Sequelize.where(
      //       Sequelize.cast(Sequelize.col("Curriculum.id"), "TEXT"),
      //       {
      //         [Op.iLike]: `%${query.curriculumQuery}%`,
      //       }
      //     ),
      //   ];
      // }

      const include = [
        {
          model: Curriculum,
          as: "curriculum",
          attributes: ["id", "year_of_specialty_training"],
          required: !!query.curriculumQuery || !!curriculumId,
          where: query.curriculumQuery
            ? {
                year_of_specialty_training: {
                  [Op.iLike]: `%${query.curriculumQuery}%`,
                },
                ...(curriculumId && { id: curriculumId }),
              }
            : curriculumId
            ? { id: curriculumId }
            : undefined,
        },
        {
          model: Subject,
          as: "subject",
          attributes: ["id", "name"],
          required: !!query.subjectQuery,
          where: query.subjectQuery
            ? {
                name: { [Op.iLike]: `%${query.subjectQuery}%` },
              }
            : undefined,
        },
        {
          model: AssessmentType,
          as: "assessmentType",
          attributes: ["id", "name"],
          required: !!query.assessmentTypeQuery,
          where: query.assessmentTypeQuery
            ? {
                name: { [Op.iLike]: `%${query.assessmentTypeQuery}%` },
              }
            : undefined,
        },
      ];
      const { count, rows } = await CurriculumSubject.findAndCountAll({
        where,
        include,
        order: [[sortBy, sortOrder]],
        limit,
        offset,
        distinct: true,
      });
      console.log("fewq", rows[0])

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
        "Error fetching curriculum subjects: " + error.message
      );
    }
  }

  async delete(compositeId) {
    try {
      const curriculumSubject = await CurriculumSubject.findOne({
        where: {
          curriculum_id: compositeId.curriculumId,
          subject_id: compositeId.subjectId,
          assessment_type_id: compositeId.assessmentTypeId,
          semester: compositeId.semester,
        },
      });

      if (!curriculumSubject) {
        return null;
      }

      await curriculumSubject.destroy();
      return curriculumSubject;
    } catch (error) {
      throw ApiError.internal(
        "Error deleting curriculum subject: " + error.message
      );
    }
  }

  async getByCompositeId(compositeId) {
    try {
      const curriculumSubject =
        await this._getCurriculumSubjectWithAssociations(
          compositeId.curriculumId,
          compositeId.subjectId,
          compositeId.assessmentTypeId,
          compositeId.semester
        );

      if (!curriculumSubject) {
        throw ApiError.notFound(
          `Curriculum subject with specified composite id not found`
        );
      }

      return curriculumSubject;
    } catch (error) {
      throw ApiError.internal(
        "Error fetching curriculum subject: " + error.message
      );
    }
  }

  async _getCurriculumSubjectWithAssociations(
    curriculumId,
    subjectId,
    assessmentTypeId,
    semester
  ) {
    return await CurriculumSubject.findOne({
      where: {
        curriculum_id: curriculumId,
        subject_id: subjectId,
        assessment_type_id: assessmentTypeId,
        semester: semester,
      },
      include: [
        {
          model: Curriculum,
          as: "curriculum",
          attributes: ["id", "year_of_specialty_training"],
          include: [
            {
              model: AcademicSpecialty,
              as: "AcademicSpecialty",
              attributes: ["code", "name"],
            },
          ],
        },
        {
          model: Subject,
          as: "subject",
          attributes: ["id", "name"],
        },
        {
          model: AssessmentType,
          as: "assessmentType",
          attributes: ["id", "name"],
        },
      ],
    });
  }
}

module.exports = new CurriculumSubjectService();
