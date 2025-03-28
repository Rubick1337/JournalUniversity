class FacultyDataForCreateDto {
    constructor({ 
        name, 
        full_name,
        dean_person = {},
    }) {
        this.name = name;
        this.fullName = full_name;

        this.deanPerson = {
            id: dean_person.id,
            surname: dean_person.surname,
            name: dean_person.name,
            middlename: dean_person.middlename,  
        };      
    }
}

module.exports = FacultyDataForCreateDto;
