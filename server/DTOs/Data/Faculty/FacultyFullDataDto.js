class FacultyFullDataDto {
    constructor({ 
        id,
        name, 
        full_name,
        dean_person = {},
    }) {
        this.id = id;
        this.name = name;
        this.full_name = full_name;

        this.dean_person = {
            id: dean_person.id,
            surname: dean_person.last_name,
            name: dean_person.first_name,
            middlename: dean_person.middle_name,  
        };      
    }
}

module.exports = FacultyFullDataDto;
