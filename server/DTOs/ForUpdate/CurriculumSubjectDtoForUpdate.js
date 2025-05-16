class CurriculumSubjectDtoForUpdate {
    constructor({ 
        subject = {},
        assessment_type = {},
        semester,
        all_hours,
        lecture_hours,
        lab_hours,
        practice_hours, 
    }) {
        this.subject_id = subject? subject.id: null;
        this.assessment_type_id = assessment_type? assessment_type.id: null;
        this.semester = semester;
        this.all_hours = all_hours;
        this.lecture_hours = lecture_hours;
        this.lab_hours = lab_hours;
        this.practice_hours = practice_hours;
    }
}

module.exports = CurriculumSubjectDtoForUpdate;
