class CurriculumSubjectDto {
  constructor({
    subject = {},
    assessment_type = {},
    semester,
    all_hours,
    lecture_hours,
    lab_hours,
    practice_hours,
  }) {
    this.subject = subject
      ? {
          id: subject.id,
          name: subject.name,
          department: subject.department 
            ? {
                id: subject.department.id,
                name: subject.department.name,
                full_name: subject.department.full_name
              }
            : null
        }
      : null;
    this.assessment_type = assessment_type
      ? {
          id: assessment_type.id,
          name: assessment_type.name,
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
