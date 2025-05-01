class CurriculumSubjectDtoForCreation {
    constructor({ 
        subjectId,
        assessmentTypeId,
        semester,
        allHours,
        lectureHours,
        labHours,
        practiceHours, 
    }) {
        this.subject_id = subjectId;
        this.assessment_type_id = assessmentTypeId;
        this.semester = semester;
        this.all_hours = allHours;
        this.lecture_hours = lectureHours;
        this.lab_hours = labHours;
        this.practice_hours = practiceHours;
    }
}

module.exports = CurriculumSubjectDtoForCreation;
