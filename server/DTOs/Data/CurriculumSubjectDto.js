class CurriculumSubjectDto {
  constructor({
    curriculum = {},
    subject = {},
    assessmentType = {},
    semester,
    all_hours,
    lecture_hours,
    lab_hours,
    practice_hours,
  }) {
    this.curriculum = curriculum
      ? {
          id: curriculum.id,
          year_of_specialty_training: curriculum.year_of_specialty_training,
        }
      : null;
    this.subject = subject
      ? {
          id: subject.id,
          name: subject.name,
        }
      : null;
    this.assessment_type = assessmentType
      ? {
          id: assessmentType.id,
          name: assessmentType.name,
        }
      : null;
      this.semester = semester;
      this.all_hours = all_hours;
      this.lecture_hours = lecture_hours;
      this.lab_hours = lab_hours;
      this.practice_hours = practice_hours;
    }
}

module.exports = CurriculumSubjectDto;
