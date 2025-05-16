class CurriculumSubjectDtoForCreation {
    constructor({ 
        subject = {},
        assessment_type = {},
        semester,
        all_hours,
        lecture_hours,
        lab_hours,
        practice_hours, 
    }) {
        this.subjectId = subject?.id;
        this.assessmentTypeId = assessment_type?.id;
        this.semester = semester;
        this.allHours = all_hours;
        this.lectureHours = lecture_hours;
        this.labHours = lab_hours;
        this.practiceHours = practice_hours;
    }
}

module.exports = CurriculumSubjectDtoForCreation;
