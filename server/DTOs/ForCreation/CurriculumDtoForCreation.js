class CurriculumDtoForCreation {
    constructor({ 
        year_of_specialty_training, 
        academic_specialty,
        education_form
    }) {
        this.year_of_specialty_training = year_of_specialty_training;
        this.specialty_code = academic_specialty? academic_specialty.code: null;
        this.education_form_id = education_form? education_form.id: null;
    }
}

module.exports = CurriculumDtoForCreation;
