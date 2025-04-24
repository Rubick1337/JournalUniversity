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
        this.subject = subject? {
            id: subject.id,
            name: subject.name,
        }: null;
        this.assessment_type = assessment_type? {
            id: assessment_type.id,
            name: assessment_type.name,
        }: null;
    }
}

module.exports = CurriculumSubjectDto;
