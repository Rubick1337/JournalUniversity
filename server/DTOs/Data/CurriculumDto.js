class CurriculumDtoForCreation {
    constructor({ 
        id,
        year_of_specialty_training, 
        AcademicSpecialty = {},
        EducationForm = {}
    }) {
        this.id = id;
        this.year_of_specialty_training = year_of_specialty_training;
        this.specialty = {
            code: AcademicSpecialty.code,
            name: AcademicSpecialty.name,
        };
        this.education_form = {
            id: EducationForm.id,
            name: EducationForm.name
        }
    }
}

module.exports = CurriculumDtoForCreation;
