// GradeService.js
const ApiError = require("../error/ApiError");
const { Grade, Topic, Student, Lesson } = require("../models/index");

class GradeService {
  async create(data) {
    try {
      // Создаем новую оценку
      const grade = await Grade.create({
        value: data.value, // значение оценки (обязательное)
        topic_id: data.topicId, // ID темы (обязательное)
        student_id: data.studentId, // ID студента (обязательное)
        lesson_id: data.lessonId || null, // ID занятия (необязательное)
      });

      // Возвращаем созданную оценку с связанными данными
      return await this._getGradeWithAssociations(grade.id);
    } catch (error) {
      throw ApiError.badRequest("Ошибка при создании оценки", error);
    }
  }

  // Вспомогательный метод для получения оценки с связанными данными
  async _getGradeWithAssociations(gradeId) {
    return await Grade.findByPk(gradeId, {
      include: [
        { model: Topic, as: 'topic' },
        { model: Student, as: 'student' },
        { model: Lesson, as: 'lesson' },
      ],
    });
  }
}

module.exports = new GradeService();